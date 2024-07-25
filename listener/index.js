var StellarSdk = require("stellar-sdk");
const config = require("../config");
const { swapTransaction, addLiquidityTransaction, removeLiquidityTransaction, getLastCrawledLedger, updateLastCrawledLedger } = require("./dbInsert");

const routerEventListener = async (startLedgerNumber) => {
    let requestBody = {
        "jsonrpc": "2.0",
        "id": 8675309,  // @TODO: Depending on what this do, need to be uuid v4
        "method": "getEvents",
        "params": {
            "startLedger": startLedgerNumber,
            "filters": [
                {
                    "type": "contract",
                    "contractIds": [config.raumNetwork.ROUTER_ADDRESS]
                }
            ],
            // @TODO: We will see if we required pagination or not
            "pagination": {
                "limit": 25
            }
        }
    }
    let events = await fetch(config.stellar.SOROBAN_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    });
    return events.json();
}

const decodeValue = async (value) => {
    const xdrObj = StellarSdk.xdr.ScVal.fromXDR(value, 'base64');
    const decodedValue = StellarSdk.scValToNative(xdrObj);
    return decodedValue;
}

const fetchEvents = async () => {
    const lastCrawled = await getLastCrawledLedger();
    const routerEvents = await routerEventListener(parseInt(lastCrawled.lastcrawledledgerid, 10));
    if (routerEvents.result) {
        const events = routerEvents.result.events;
        for (var i=0; i<events.length; i++) {
            const event = events[i];
            const decodedValue = await decodeValue(event.value);
            if (event.topic[1] === "AAAADwAAABNhZGRfbGlxdWlkaXR5X2V2ZW50AA==") {
                // Add Liquidity
                await addLiquidityTransaction(event, decodedValue)
            } else if (event.topic[1] === "AAAADwAAABZyZW1vdmVfbGlxdWlkaXR5X2V2ZW50AAA=") {
                // Remove Liquidity
                await removeLiquidityTransaction(event, decodedValue)
            } else if (event.topic[1] === "AAAADwAAABFzd2FwX3Rva2Vuc19ldmVudAAAAA==") {
                // Swap
                await swapTransaction(event, decodedValue)
            }
        }
        await updateLastCrawledLedger(routerEvents.result.latestLedger, lastCrawled.id)
    }
}

module.exports = {
    fetchEvents
};
