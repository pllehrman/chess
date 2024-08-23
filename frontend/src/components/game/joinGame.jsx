// On the node side, the route /games/join needs to be updated and websocket logic needs to be refined.
export async function joinGame(gameId) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/join`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error joining game: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && document.cookie.includes("session_cookie")) {
        return; // Successful join, return true
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      // If this is the last attempt, return false
      if (attempt === 3) {
        return;
      }
    }
  }

  return; // If it fails after 3 attempts
}
