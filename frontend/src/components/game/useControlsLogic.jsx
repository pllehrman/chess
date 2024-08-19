export function useControlsLogic(safeGameMutate, setGameOver, setResult, setWinner) {
    const resetGame = () => {
        safeGameMutate((game) => {
            game.reset();
        });
        setGameOver(false);
        setResult(null);
        setWinner(null);
    };

    const undoMove = () => {
        safeGameMutate((game) => {
            game.undo();
        });
    };

    return {resetGame, undoMove};
}