import { cookies } from "next/headers";

export const retrieveSession = () => {
  const cookie = cookies().get("session_token");
  let sessionId = null;
  let sessionUsername = null;

  if (cookie) {
    try {
      const sessionData = JSON.parse(cookie.value);
      sessionId = sessionData.id;
      sessionUsername = sessionData.username;
    } catch (error) {
      throw new Error("error in parsing cookie.");
    }
  }

  return { sessionId, sessionUsername };
};
