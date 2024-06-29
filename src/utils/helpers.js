const config = require("../../config/index");
const axios = require("axios");
const logger = require("../logger");

const getStellarPublicAssetData = async () => {
  let requestConfig = {
    method: "get",
    url: `${config.stellar.EXPERT_BASE_URL}/explorer/public/asset/?limit=30&order=desc&sort=rating`,
    headers: {},
  };
  try {
    const response = await axios.request(requestConfig);
    return response.data;
  } catch (error) {
    logger.error(`Error while fetching stellar public asset data ${error}`);
    return {};
  }
};

const getPrice = async (tokenName) => {
  let requestConfig = {
    method: "get",
    url: `${config.stellar.COIN_GECKO_BASE_URL}/api/v3/simple/price/?ids=${tokenName}&vs_currencies=usd`,
    headers: {},
  };
  try {
    const response = await axios.request(requestConfig);
    return response.data;
  } catch (error) {
    logger.error(`Error while fetching price from coingecko ${error}`);
    return {};
  }
};

const getStellarPublicLedgerData = async () => {};

module.exports = {
  getStellarPublicAssetData,
  getPrice
};
