export async function newChessGame(
  type,
  playerColor,
  timeRemaining,
  timeIncrement,
  username,
  sessionId
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        playerColor,
        playerWhiteTimeRemaining: timeRemaining * 60, // convert to seconds
        playerBlackTimeRemaining: timeRemaining * 60, // convert to seconds
        timeIncrement,
        username,
        sessionId,
      }),
    });

    // Inspecting the Set-Cookie header
    // const setCookieHeader = response.headers.get("Set-Cookie");
    // console.log("Set-Cookie header:", setCookieHeader);

    if (!response.ok) {
      throw new Error(`Error starting new game: ${response.statusText}`);
    }

    const data = await response.json();
    return data.game;
  } catch (error) {
    console.error("Error starting new game:", error);
    throw error;
  }
}
