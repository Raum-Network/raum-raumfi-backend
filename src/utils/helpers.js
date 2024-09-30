const config = require("../../config/index");
const axios = require("axios");
const logger = require("../logger");

const getStellarPublicAssetData = async () => {
  const requestConfig = {
    method: "get",
    url: `${config.stellar.EXPERT_BASE_URL}/explorer/public/asset/?limit=50&order=desc&sort=rating`,
    headers: {},
  };

  const mergedResponse = [];

  try {
    let nextUrl = requestConfig.url;
    const requests = [];

    for (let i = 0; i < 3; i++) {
      requests.push(axios.request({ ...requestConfig, url: nextUrl }));
      if (i === 0) {
        const initialResponse = await requests[0];
        const nextCursor = initialResponse.data._links.next.href;
        if (!nextCursor) break; // Stop if no more pages
        nextUrl = `${config.stellar.EXPERT_BASE_URL}${nextCursor}`;
      }
    }

    const responses = await Promise.all(requests);
    const mergedResponse = responses.reduce((acc, response) => {
      return acc.concat(response.data._embedded.records);
    }, []);
    
    return mergedResponse;
  } catch (error) {
    logger.error(`Error while fetching stellar public asset data: ${error}`);
    return [];
  }
  return mergedResponse;
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

const getStellarPublicLedgerData = async () => { };

module.exports = {
  getStellarPublicAssetData,
  getPrice
};
