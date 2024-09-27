const { Session } = require("../db/models");
const crypto = require("crypto");
const asyncWrapper = require("../middleware/asyncWrapper");
const { createCustomError } = require("../middleware/customError");

const newSession = asyncWrapper(async (req, res) => {
  const session = await createSession(null);
  res.status(200).json({ session });
});

async function getRandomUsername() {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();

    return data.results[0].login.username;
  } catch (error) {
    console.error(`error requesting session username`, error);
    return "Unnamed Grandmaster";
  }
}

async function createSession(sessionUsername) {
  try {
    const id = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const randomUsername = await getRandomUsername();
    const defaultUsername = randomUsername || "Unnamed Grandmaster";

    const session = await Session.create({
      id,
      username: sessionUsername || defaultUsername,
      expiresAt,
    });

    return session;
  } catch (error) {
    throw createCustomError(`Error creating session: ${error.message}`, 500);
  }
}

async function updateUsernameBySessionId(sessionId, newUsername) {
  try {
    const session = await Session.findByPk(sessionId);

    if (!session) {
      throw createCustomError(
        `Error retrieving session with ID: ${sessionId}`,
        500
      );
    }

    if (session.username !== newUsername) {
      session.username = newUsername;
      session.save();
    }
    return session.username;
  } catch (error) {
    throw createCustomError(
      `Error in saving new username to session ID: ${sessionId} and err: ${error.message}`,
      500
    );
  }
}

module.exports = {
  newSession,
  createSession,
  updateUsernameBySessionId,
};
