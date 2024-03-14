import {readFileSync, writeFileSync} from "fs";
import {inflateSync} from "zlib";
import {fileURLToPath} from "url";
import path from "path";


const __dirname = fileURLToPath(new URL(".", import.meta.url));


const regions = [
	"general",
	"AE",
	"AT",
	"BE",
	"BR",
	"CA",
	"CA_FR",
	"CH",
	"CH_DE",
	"CH_FR",
	"CH_IT",
	"CZ",
	"DE",
	"DK",
	"ES",
	"FI",
	"FR",
	"GB",
	"GR",
	"IE",
	"IT",
	"JP",
	"KR",
	"MX",
	"NL",
	"NO",
	"PL",
	"PR",
	"PT",
	"SE",
	"SG",
	"SK",
	"US",

	// Removed:
	// "develop_general",
	// "preprod_general",
	// "production_general",
	// "staging_general",
];

const key = readFileSync(`${__dirname}/../resources/configuration.json`);

for(const region of regions) {
	const resp = await fetch(`https://api.3stripes.net/configurations-trilogy/android/global/production/${region}.config.json.enc`);
	if(!resp.ok) {
		if(resp.status === 404) {
			console.log(`Region "${region}" not found!`);
		}
		else {
			console.log(await resp.text());
		}

		continue;
	}

	const encoded = new Uint8Array(await resp.arrayBuffer());
	const decrypted = decrypt(encoded, key); // xor
	const decompressed = inflateSync(decrypted); // unzip
	const parsed = JSON.parse(decompressed.toString("utf8"));
	// console.log(`${region}:`, parsed);

	// noinspection JSUnresolvedVariable
	if(parsed.orders.adyen) {
		// noinspection JSUnresolvedVariable
		console.log(`${region}:\n\t${parsed.orders.adyen.publicKey}`);
	}

	const outputFilename = path.resolve(`${__dirname}/../output/config_${region}.json`);
	writeFileSync(outputFilename, JSON.stringify(parsed, null, 4), "utf8");
	console.log(`Wrote "${outputFilename}"`);
}


/**
 * @param {Uint8Array} input The byte array to be decrypted.
 * @param {Uint8Array} key The key used for decryption.
 * @returns {Uint8Array} The decrypted byte array.
 */
function decrypt(input, key) {
	if(key.length === 0) {
		return input;
	}

	const output = new Uint8Array(input.length);
	for(let i = 0, j = 0; i < input.length; i++) {
		output[j] = input[i] ^ key[j % key.length];
		j++;
	}

	return output;
}