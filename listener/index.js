var StellarSdk = require("stellar-sdk");
const config = require("../config");

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

const parseSwapEvent = async (swapEvent) => {
    const base64XDR = swapEvent.value;
    const xdrObj = StellarSdk.xdr.ScVal.fromXDR(base64XDR, 'base64');
    const data = StellarSdk.scValToNative(xdrObj);
    return data;
}

const decodeValue = async (value) => {
    const xdrObj = StellarSdk.xdr.ScVal.fromXDR(value, 'base64');
    const decodedValue = StellarSdk.scValToNative(xdrObj);
    return decodedValue;
}

const fetchEvents = async () => {
    const routerEvents = await routerEventListener(522907);
    const events = routerEvents.result.events;
    for (var i=0; i<events.length; i++) {
        const event = events[i];
        console.log(event.topic[1])
        const decodedValue = await decodeValue(event.value);
        if (event.topic[1] === "AAAADwAAABNhZGRfbGlxdWlkaXR5X2V2ZW50AA==") {
            // Add Liquidity
            console.log(1)
        } else if (event.topic[1] === "AAAADwAAABZyZW1vdmVfbGlxdWlkaXR5X2V2ZW50AAA=") {
            // Remove Liquidity
            console.log(2)
        } else if (event.topic[1] === "AAAADwAAABFzd2FwX3Rva2Vuc19ldmVudAAAAA==") {
            // Swap
            console.log(3)
        }
    }
    // const base64XDR = json.result.events[0].value;
    

}

fetchEvents();