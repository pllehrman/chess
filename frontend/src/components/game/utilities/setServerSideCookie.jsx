"use server";

import { cookies } from "next/headers";

export async function setServerSideCookie(sessionId, sessionUsername) {
  if (!sessionId) return;

  const cookieStore = cookies();

  cookieStore.set({
    name: "chessgambit_session", // You should also include the cookie's name
    value: JSON.stringify({ id: sessionId, username: sessionUsername }), // Stringify the object
    httpOnly: true,
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days expiry
    secure: true,
    path: "/",
  });
}
export async function updateCookieUsername(sessionUsername) {
  if (!sessionUsername) return;

  const cookieStore = cookies();
  const cookie = cookieStore.get("chessgambit_session");

  if (cookie) {
    try {
      const sessionData = JSON.parse(cookie.value);
      sessionData.username = sessionUsername;
      const expiryDate = sessionData.expires
        ? new Date(sessionData.expires)
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

      cookieStore.set({
        name: "chessgambit_session",
        value: JSON.stringify(sessionData),
        httpOnly: true,
        expires: expiryDate,
        secure: true,
        path: "/",
        sameSite: "None",
      });
    } catch (error) {
      console.error(`Error in parsing cookie: ${error.message}`);
    }
  }
}
