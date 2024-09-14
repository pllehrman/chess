export async function newChessGame(
  type,
  timeRemaining,
  timeIncrement,
  sessionId,
  sessionUsername,
  difficulty
) {
  let updatedDifficulty = type === "pvp" ? null : difficulty;

  try {
    const apiURL = `${process.env.NEXT_PUBLIC_API_URL}/games`;
    const response = await fetch(apiURL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        playerWhiteTimeRemaining: timeRemaining * 60, // convert to seconds
        playerBlackTimeRemaining: timeRemaining * 60, // convert to seconds
        timeIncrement,
        sessionId,
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
    return { game: data.game, session: data.session };
  } catch (error) {
    console.error("error starting new game:", error);
  }
}
