const express = require("express");
const getController = require("../../controllers/token/get");

const router = express.Router();

router.get("/stats", getController.getTokenStats);

module.exports = router;
