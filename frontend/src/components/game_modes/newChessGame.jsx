export async function newChessGame(
  type,
  playerColor,
  timeRemaining,
  timeIncrement,
  sessionUsername,
  difficulty
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
        sessionUsername,
        difficulty,
      }),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error(
        `error fetching to start a new game: ${response.message}`
      );
    }

    const data = await response.json();
    console.log(data);
    return data.game;
  } catch (error) {
    console.error("error starting new game:", error);
  }
}
