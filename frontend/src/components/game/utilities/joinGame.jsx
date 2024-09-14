export async function joinGame(gameId, orientation, sessionId) {
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

    if (!sessionId) {
      return {
        isAvailable: true,
        game: data.game,
        sessionId: data.session.id,
        sessionUsername: data.session.username,
      };
    }

    return { isAvailable: true, game: data.game };
  } catch (error) {
    console.error(`error joining game`);
    return {
      isAvailable: false,
      game: null,
    };
  }
}
