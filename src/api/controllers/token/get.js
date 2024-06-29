const { getStellarPublicAssetData } = require("../../../utils/helpers");

exports.getTokenStats = async (req, res) => {
  const stellarPublicData = await getStellarPublicAssetData();
  const stellarRecordsPublicData = stellarPublicData["_embedded"]["records"];
  const response = [];
  for (record of stellarRecordsPublicData) {
    if (record["asset"] == "XLM") {
      response.push({
        name: "Stellar",
        symbol: "XLM",
      });
    }
    if (
      record["asset"] ==
      "EURC-GAQRF3UGHBT6JYQZ7YSUYCIYWAF4T2SAA5237Q5LIQYJOHHFAWDXZ7NM-1"
    ) {
      response.push({
        name: "EUROC",
        symbol: "EUROC",
      });
    }
    if (
      record["asset"] ==
      "USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN-1"
    ) {
      response.push({
        name: "USDC",
        symbol: "USDC",
      });
    }
    response.push({
      price: record["price7d"].at(-1)[1],
      "24hrChange": (
        ((record["price7d"].at(-1)[1] - record["price7d"].at(-2)[1]) /
          record["price7d"].at(-2)[1]) *
        100
      ).toFixed(2),
      "7dayVolume": record["volume7d"],
      marketCap: record["supply"],
      "7dChart": record["price7d"],
    });
  }
  res.status(200).json({
    success: true,
    data: response,
  });
};
