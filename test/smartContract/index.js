const { createPair, swap } = require("./pair");
const { deployMintAsset } = require("./token");
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server(
    "https://horizon-testnet.stellar.org/",
);
const serverSoroban = new StellarSdk.SorobanRpc.Server(
    "https://soroban-testnet.stellar.org:443",
);
var issuerKeys = StellarSdk.Keypair.fromSecret(
    "",
);
var receivingKeys = StellarSdk.Keypair.fromSecret(
    "",
);
const factoryContractAddress = "CAIHBGWAPVVT5C4PX3TVWCQY75OP6LIMNPBVLJDXLZ6HZPYNAAN4ME5Z";

const init = async () => {
    // tokenA = await deployMintAsset(StellarSdk, server, "test11", issuerKeys, receivingKeys, "1000");
    // tokenB = await deployMintAsset(StellarSdk, server, "test22", issuerKeys, receivingKeys, "1000");
    // await createPair(StellarSdk, serverSoroban, receivingKeys, factoryContractAddress, "CAIHBGWAPVVT5C4PX3TVWCQY75OP6LIMNPBVLJDXLZ6HZPYNAAN4ME5Z", "CD6DSYYAFV677F2P6ECAM4D25HDB7NOZZLNSSGVTDOFCVXJXDW6EAKIA");
};

init();


// Extra code, not required!! (Maybe!!)

const getTokens = async (publicKey) => {
    try {
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
        );
        const responseJSON = await response.json();
        console.log("SUCCESS! You have a new account :)\n", responseJSON);
    } catch (e) {
        console.error("ERROR!", e);
    }
};