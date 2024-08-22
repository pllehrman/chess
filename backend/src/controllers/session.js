const { Session } = require("../db/models");
const crypto = require("crypto");
const asyncWrapper = require("../middleware/asyncWrapper");
const { createCustomError } = require("../middleware/customError");

const createSessionAPI = asyncWrapper(async (req, res) => {
  const session = await createSession("Unnamed Grand Master");
  setSessionCookie(res, session);

  res.status(200).json({ session });
});

async function createSession(username) {
  try {
    const id = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      id,
      username: username,
      expiresAt,
    });

    return session;
  } catch (error) {
    throw createCustomError(`Error creating session: ${error.msg}`, 500);
  }
}

async function getUsernameBySessionId(sessionId) {
  try {
    const session = await Session.findByPk(sessionId);

    if (!session) {
      throw createCustomError(
        `Error retrieving session with ID: ${sessionId}`,
        500
      );
    }

    return session.username;
  } catch (error) {
    throw createCustomError(
      `Error in retrieving username from session ID: ${sessionId} and err: ${error.msg}`,
      500
    );
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

    session.username = newUsername;
    session.save();

    return session;
  } catch (error) {
    throw createCustomError(
      `Error in saving new username to session ID: ${sessionId} and err: ${error.msg}`,
      500
    );
  }
}

async function checkCurrentSession(sessionId, username, res) {
  if (!sessionId) {
    const session = await createSession(username);

    setSessionCookie(res, session);
    return session;
  } else {
    const currentUsername = await getUsernameBySessionId(sessionId);

    if (currentUsername !== username) {
      const session = await updateUsernameBySessionId(sessionId, username);
      setSessionCookie(res, session);
      return session;
    }

    return { id: sessionId, username: currentUsername };
  }
}

function setSessionCookie(res, session) {
  console.log("ISSUING A NEW COOKIE");
  res.cookie(
    "session_token",
    JSON.stringify({ id: session.id, username: session.username }),
    {
      httpOnly: true,
      expires: session.expiresAt,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    }
  );
}

module.exports = {
  createSessionAPI,
  createSession,
  getUsernameBySessionId,
  updateUsernameBySessionId,
  checkCurrentSession,
};
