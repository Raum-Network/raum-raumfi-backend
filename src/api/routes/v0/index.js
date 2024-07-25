const express = require("express");
const tokenRoutes = require("./tokenRoutes");
const pairRoutes = require("./pairRoutes");
const liquidityRoutes = require("./positionRoutes");

const router = express.Router();

router.use("/token", tokenRoutes);
router.use("/pairs", pairRoutes);
router.use("/positions", liquidityRoutes);

module.exports = router;
