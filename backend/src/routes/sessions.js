const express = require("express");
const router = express.Router();

const { newSession } = require("../controllers/session.js");

router.route("/").post(newSession);

module.exports = router;
