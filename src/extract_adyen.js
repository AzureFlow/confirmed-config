import {readdirSync, readFileSync, writeFileSync} from "fs";
import {fileURLToPath} from "url";


const __dirname = fileURLToPath(new URL(".", import.meta.url));


const regions = readdirSync(`${__dirname}/../output/`)
	.filter(x => x.includes("config_") && !x.includes("adyen_keys.json"))
	.map(x => x.split("_")[1].split(".json")[0]);

const results = {};
for(const region of regions) {
	const contents = JSON.parse(readFileSync(`${__dirname}/../output/config_${region}.json`, "utf8"));

	// noinspection JSUnresolvedVariable
	if(contents.orders.adyen) {
		// noinspection JSUnresolvedVariable
		results[region] = contents.orders.adyen.publicKey;
	}
}

writeFileSync(`${__dirname}/../output/adyen_keys.json`, JSON.stringify(results, null, 4), "utf8");
console.log("Done!");