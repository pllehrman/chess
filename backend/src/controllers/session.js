const { Session } = require("../db/models");
const crypto = require("crypto");

async function createSession(username) {
  const id = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    id,
    username: username,
    expiresAt,
  });

  return session;
}

module.exports = {
  createSession,
};
