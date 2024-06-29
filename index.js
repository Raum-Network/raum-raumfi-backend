const http = require("http");
const app = require("./src/api/app");
const logger = require("./src/logger");

const httpServer = http.createServer(app);
require("dotenv").config();

httpServer.listen(3000, () => {
  logger.info(`Server is running on port 3000`);
});
