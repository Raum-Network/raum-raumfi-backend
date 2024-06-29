const developmentConfig = require("./development");
const productionConfig = require("./production");
const localConfig = require("./local");

const env = process.env.NODE_ENV || "local";

let config;

switch (env) {
  case "development":
    config = developmentConfig;
    break;
  case "production":
    config = productionConfig;
    break;
  default:
    config = localConfig;
}

module.exports = config;
