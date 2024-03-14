# Confirmed Config Scraper

Downloads, decrypts, & decompresses Adidas Confirmed remote configs.

```sh
git clone https://github.com/AzureFlow/confirmed-config
cd confirmed-config
npm start
```

View the downloaded remote configs in `./output`.

The Adyen RSA encryption keys can be found at `.orders.adyen.publicKey`. e.g.:

```sh
cat output/config_*.json | jq -r ".orders.adyen.publicKey"
```