const { Session } = require("../db/models");
const crypto = require("crypto");
const asyncWrapper = require("../middleware/asyncWrapper");
const { createCustomError } = require("../middleware/customError");

async function getRandomUsername() {
  const fetch = (await import("node-fetch")).default;

  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();
  return data.results[0].login.username;
}

const sendSessionCookie = asyncWrapper(async (req, res) => {
  sessionId = req.params.id;
  const session = await Session.findByPk(sessionId);

  if (!session) {
    throw createCustomError(`error finding session with id: ${sessionId}`, 404);
  }

  setSessionCookie(res, session);
  res.status(200).end();
});
async function createSession(res, sessionUsername) {
  try {
    const id = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const randomUsername = await getRandomUsername();
    const defaultUsername = randomUsername || "Unnamed Grand Master";

    const session = await Session.create({
      id,
      username: sessionUsername || defaultUsername,
      expiresAt,
    });
    setSessionCookie(res, session);

    return session;
  } catch (error) {
    throw createCustomError(`Error creating session: ${error.message}`, 500);
  }
}

async function updateUsernameBySessionId(res, sessionId, newUsername) {
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
    setSessionCookie(res, session);

    return session;
  } catch (error) {
    throw createCustomError(
      `Error in saving new username to session ID: ${sessionId} and err: ${error.message}`,
      500
    );
  }
}

// Method only works when the incoming request actually contains cookies!
async function checkAndUpdateCurrentSession(req, res, newUsername) {
  let session = req.cookies.session_cookie;
  if (session) {
    session = JSON.parse(session);
  }

  if (!session) {
    session = await createSession(res, newUsername);
    return session;
  }

  if (newUsername && session.username !== newUsername) {
    session = await updateUsernameBySessionId(res, session.id, newUsername);
    return session;
  }

  return session;
}

function setSessionCookie(res, session) {
  res.cookie(
    "session_cookie",
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
  createSession,
  updateUsernameBySessionId,
  checkAndUpdateCurrentSession,
  sendSessionCookie,
};
