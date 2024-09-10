import { cookies } from "next/headers";

// NEEDS TO BE REWORKED. COOKIES AREN'T STICKING IN INCOGNITO MODE -> Investigate
export const checkForCookie = async () => {
  const cookie = cookies().get("session_token");
  let sessionId = null;
  let sessionUsername = null;

  if (cookie) {
    try {
      const sessionData = JSON.parse(cookie.value);
      sessionId = sessionData.id;
      sessionUsername = sessionData.username;
    } catch (error) {
      const session = await requestNewSession(res);
      sessionId = session.sessionId;
      sessionUsername = session.sessionUsername;
    }
  } else {
    const session = await requestNewSession(res);
    sessionId = session.sessionId;
    sessionUsername = session.sessionUsername;
  }
  return { sessionId, sessionUsername };
};

async function requestNewSession() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/sessions`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching new session: ${response.statusText}`);
    }

    const data = await response.json();

    // const cookieValue = JSON.stringify({
    //   id: data.session.id,
    //   username: data.session.username,
    // });

    // res.setHeader(
    //   "Set-Cookie",
    //   `session_token=${cookieValue}; Path=/; HttpOnly; SameSite=Lax`
    // );

    return {
      sessionId: data.session.id,
      sessionUsername: data.session.username,
    };
  } catch (error) {
    throw error;
  }
}
