import { cookies } from "next/headers";

export const retrieveSession = () => {
  const cookie = cookies().get("chessgambit_session");
  let sessionId = null;
  let sessionUsername = null;

  if (cookie) {
    try {
      const sessionData = JSON.parse(cookie.value);
      sessionId = sessionData.id;
      sessionUsername = sessionData.username;
    } catch (error) {
      console.error(`error in parsing cookie: ${error.message}`);
    }
  }

  return { sessionId, sessionUsername };
};
