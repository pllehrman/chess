const express = require("express");
const router = express.Router();

const { sendSessionCookie } = require("../controllers/session");

router.route("/:id").get(sendSessionCookie);

module.exports = router;
