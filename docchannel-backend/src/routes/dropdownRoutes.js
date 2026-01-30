const express = require("express");
const router = express.Router();
const { getDropDownItem } = require("../controllers/dropdownController");

router.get("/:type", getDropDownItem);

module.exports = router;
