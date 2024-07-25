const express = require("express");
const getController = require("../../controllers/liquidity/get");

const router = express.Router();

router.get("/", getController.getLiquidity);

module.exports = router;
