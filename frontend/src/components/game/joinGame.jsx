export async function joinGame(gameId, orientation, sessionId) {
  const maxRetries = 3;
  const retryDelay = 1500;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/join`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId,
            orientation,
            sessionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `error in joining game with status ${response.status} and message: ${response.message}`
        );
      }

      const data = await response.json();
      return { isAvailable: true, game: data.game };
    } catch (error) {
      console.error(`error joining game on ${attempt}: ${error.message}`);
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return { isAvailable: false, game: null };
}
