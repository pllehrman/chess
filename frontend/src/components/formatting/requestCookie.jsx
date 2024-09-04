export const requestCookie = async (sessionId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`,
    {
      method: "GET",
      credentials: "include", // Ensures cookies are included in the request
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to retrieve cookie: ${response.status}`);
  }
};
