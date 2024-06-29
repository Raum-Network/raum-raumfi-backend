const express = require("express");
const validateRequest = require("../middlewares/validateRequest");
const v0Routes = require("./v0");

const router = express.Router();

router.use('/api/v0', v0Routes);

module.exports = router;