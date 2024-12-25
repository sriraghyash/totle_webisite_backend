const express = require("express");
const { getLanguages, insertLanguages } = require("../controllers/languageController");

const router = express.Router();

router.get("/", getLanguages);
router.post("/", insertLanguages);

module.exports = router;
