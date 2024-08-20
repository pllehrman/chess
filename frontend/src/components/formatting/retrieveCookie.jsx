import { cookies } from "next/headers";

export const retrieveCookie = () => {
  const cookie = cookies().get("session_token");
  let sessionId, sessionUsername;
  if (cookie) {
    const sessionData = JSON.parse(cookie.value);
    sessionId = sessionData.id;
    sessionUsername = sessionData.username;
  }

  return { sessionId, sessionUsername };
};
