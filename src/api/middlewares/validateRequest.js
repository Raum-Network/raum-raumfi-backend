// src/middlewares/validateRequest.js
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const path = require("path");
const fs = require("fs");

function validateRequest(req, res, next) {
    const method = req.method.toLowerCase();
    const pathParts = req.originalUrl.split('/').filter(Boolean);
    const version = pathParts[1];
    const endpoint = pathParts[pathParts.length - 1];
    const schemaPath = path.join(__dirname, `../schemas/${version}/${endpoint}/${method}.json`);
    if (fs.existsSync(schemaPath)) {
        const schema = require(schemaPath);
        const validate = ajv.compile(schema);
        const dataToValidate = req.method === "GET" ? req.query : req.body;
        if (!validate(dataToValidate)) {
            return res.status(400).json({ errors: validate.errors });
        }
    }
    console.log(11)
    next();
}

module.exports = validateRequest;
