const express = require("express");
const getController = require("../../controllers/pair/get");

const router = express.Router();

router.get("/", getController.getPairs);

module.exports = router;
