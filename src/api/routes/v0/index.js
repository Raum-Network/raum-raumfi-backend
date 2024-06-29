const express = require("express");
const tokenRoutes = require("./tokenRoutes");
const pairRoutes = require("./pairRoutes");

const router = express.Router();

router.use("/token", tokenRoutes);
router.use("/pairs", pairRoutes);

module.exports = router;
