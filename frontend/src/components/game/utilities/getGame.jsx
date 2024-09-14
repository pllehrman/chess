export async function getGame(gameId, sessionId) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/games/${gameId}?t=${new Date().getTime()}`
    );

    if (!response.ok) {
      throw new Error(
        `error in joining game with status ${response.status} and message: ${response.message}`
      );
    }

    const { game } = await response.json();

    return game;
  } catch (error) {
    console.error(`error joining game:`, error.msg);
    return null;
  }
}
