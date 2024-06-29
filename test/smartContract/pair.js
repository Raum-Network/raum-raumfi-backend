
const createPair = async (
  StellarSdk,
  server,
  issuerKeyPair,
  factoryContractAddress,
  tokenAAddress,
  tokenBAddress
) => {
  const contract = new StellarSdk.Contract(factoryContractAddress);
  const sourceAccount = await server.getAccount(issuerKeyPair.publicKey());
  let builtTransaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(contract.call("create_pair",
      ...[
        StellarSdk.nativeToScVal(tokenAAddress, { type: "address" }),
        StellarSdk.nativeToScVal(tokenBAddress, { type: "address" }),
      ]))
    .setTimeout(300)
    .build();
  let preparedTransaction = await server.prepareTransaction(builtTransaction);
  preparedTransaction.sign(issuerKeyPair);
  try {
    let sendResponse = await server.sendTransaction(preparedTransaction);
    if (sendResponse.status === "PENDING") {
      let getResponse = await server.getTransaction(sendResponse.hash);
      while (getResponse.status === "NOT_FOUND") {
        console.log("Waiting for transaction confirmation...");
        getResponse = await server.getTransaction(sendResponse.hash);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (getResponse.status === "SUCCESS") {
        if (!getResponse.resultMetaXdr) {
          throw "Empty resultMetaXDR in getTransaction response";
        }
        let transactionMeta = getResponse.resultMetaXdr;
        let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
        console.log(`Transaction result: ${returnValue.value()}`);
      } else {
        throw `Transaction failed: ${getResponse.resultXdr}`;
      }
    } else {
      throw sendResponse.errorResultXdr;
    }
  } catch (err) {
    console.log("Sending transaction failed");
    console.log(JSON.stringify(err));
  }
};

const swap = async (
  StellarSdk,
  server,
  issuerKeyPair,
  pairContractAddress,
  tokenAAddress,
  tokenBAddress,
  swapAmount
) => {
  const contract = new StellarSdk.Contract(pairContractAddress);
  const sourceAccount = await server.getAccount(issuerKeyPair.publicKey());
  let builtTransaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "swap_exact_tokens_for_tokens",
        ...[
          StellarSdk.nativeToScVal("12311", { type: "i128" }),
          StellarSdk.nativeToScVal("0", { type: "i128" }),
          StellarSdk.nativeToScVal(
            [
              StellarSdk.nativeToScVal(
                tokenAAddress,
                { type: "address" }
              ),
              StellarSdk.nativeToScVal(
                tokenBAddress,
                { type: "address" }
              ),
            ],
            { type: "Vec" }
          ),
          StellarSdk.nativeToScVal(
            issuerKeyPair.publicKey(),
            { type: "address" }
          ),
          StellarSdk.nativeToScVal(swapAmount, { type: "u64" }),
        ]
      )
    )
    .setTimeout(300)
    .build();
};

module.exports = {
  createPair,
  swap
};