const deployMintAsset = async (
  StellarSdk,
  server,
  assetName,
  issuerKeys,
  receivingKeys,
  mintAmount
) => {
  var assetDetails = new StellarSdk.Asset(assetName, issuerKeys.publicKey());
  server.loadAccount(receivingKeys.publicKey())
  .then(function (receiver) {
    var transaction = new StellarSdk.TransactionBuilder(receiver, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({asset: assetDetails}),
      )
      .setTimeout(100)
      .build();
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .then(function () {
    return server.loadAccount(issuerKeys.publicKey());
  })
  .then(function (issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receivingKeys.publicKey(),
          asset: assetDetails,
          amount: mintAmount,
        }),
      )
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuerKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .catch(function (error) {
    console.error("Error!", error);
  });
};

module.exports = {
  deployMintAsset
};