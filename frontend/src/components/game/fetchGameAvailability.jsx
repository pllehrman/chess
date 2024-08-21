export async function fetchGameAvailability(gameId, orientation, sessionId) {
  const url = `${
    process.env.NEXT_PUBLIC_BACKEND_URL
  }/games/check-game-availability?id=${gameId}&orientation=${orientation}&sessionId=${sessionId}&t=${new Date().getTime()}`;
  const maxRetries = 3;
  const retryDelay = 1500;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Fetching game availability...`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("DATA:", data);
      if (data.isAvailable) {
        return { isAvailable: data.isAvailable, game: data.game };
      }
    } catch (error) {
      console.error(`Fetch error on attempt ${attempt}: ${error.message}`);
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return { isAvailable: false, gameData: null };
}
