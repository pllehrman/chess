const express = require("express");
const router = express.Router();

const { createSessionAPI } = require("../controllers/session");

router.route("/").post(createSessionAPI);

module.exports = router;
