export function gameControls(
  type,
  orientation,
  timeRemaining,
  timeIncrement,
  sessionUsername,
  difficulty,
  setWinner,
  setResult,
  whiteTime,
  blackTime,
  sendDrawOffer,
  sendGameOver,
  setOutgoingDrawOffer
) {
  const refreshGame = async () => {
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
          playerWhiteTimeRemaining: timeRemaining, // convert to seconds
          playerBlackTimeRemaining: timeRemaining, // convert to seconds
          timeIncrement,
          sessionUsername,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `error fetching to start a new game: ${response.message}`
        );
      }

      const data = await response.json();
      window.open(`/compete/${data.game.id}/${orientation}`, "_blank");
    } catch (error) {
      console.error("error starting new game:", error);
    }
  };

  const resignGame = () => {
    const winnerColor = orientation === "white" ? "black" : "white";
    sendGameOver(winnerColor, whiteTime, blackTime);
    setWinner(winnerColor);
    setResult("Resignation");
  };

  const offerDraw = () => {
    sendDrawOffer(null);
    setOutgoingDrawOffer(true);
  };

  return { refreshGame, resignGame, offerDraw };
}
