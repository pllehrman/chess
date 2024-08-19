export async function newChessGame(
  type,
  playerColor,
  timeRemaining,
  timeIncrement,
  username,
  sessionId
) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/games`;
    console.log(url);
    const response = await fetch(url, {
      method: "POST",
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
