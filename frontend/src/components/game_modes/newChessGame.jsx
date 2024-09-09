export async function newChessGame(
  type,
  orientation,
  timeRemaining,
  timeIncrement,
  sessionUsername,
  difficulty
) {
  let updatedDifficulty = type === "pvp" ? null : difficulty;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        orientation,
        playerWhiteTimeRemaining: timeRemaining * 60, // convert to seconds
        playerBlackTimeRemaining: timeRemaining * 60, // convert to seconds
        timeIncrement,
        sessionUsername,
        difficulty: updatedDifficulty,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `error fetching to start a new game: ${response.message}`
      );
    }

    const data = await response.json();
    return data.game;
  } catch (error) {
    console.error("error starting new game:", error);
  }
}
