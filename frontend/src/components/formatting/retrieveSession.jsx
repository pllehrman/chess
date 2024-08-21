import { cookies } from "next/headers";

export const retrieveSession = async () => {
  const cookie = cookies().get("session_token");
  let sessionId = null;
  let sessionUsername = null;

  if (cookie) {
    try {
      const sessionData = JSON.parse(cookie.value);
      sessionId = sessionData.id;
      sessionUsername = sessionData.username;
    } catch (error) {
      const sesssion = await requestNewSession();
      sessionId = session.sessionId;
      sessionUsername = session.sessionUsername;
    }
  } else {
    const session = await requestNewSession();
    sessionId = session.sessionId;
    sessionUsername = session.sessionUsername;
  }
  return { sessionId, sessionUsername };
};

async function requestNewSession() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching new session: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      sessionId: data.session.id,
      sessionUsername: data.session.username,
    };
  } catch (error) {
    throw error;
  }
}
