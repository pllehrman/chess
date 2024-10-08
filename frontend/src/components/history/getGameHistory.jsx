export async function getGameHistory(sessionId) {
  if (!sessionId) {
    return {
      inProgressGames: [],
      completedGames: [],
    };
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/games/session/${sessionId}?t=${new Date().getTime()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    inProgressGames: data.inProgressGames,
    completedGames: data.completedGames,
  };
}
