'use client';

// import { useMemo, useEffect, useState, useRef } from 'react';
import Board from './Board';
import Controls from './Controls';
import ResultNotice from './ResultNotice';
import { ChessGameLogic } from '../../hooks/ChessGameLogic';
import { useFetchGameState } from '../../hooks/useFetchGameState';
import { useChessPieces } from '../../hooks/useChessPieces';
import { useControlsLogic } from '../../hooks/useControlsLogic';
import { onDropHandler } from '../../utils/onDropHandler';


export default function MainGame({ gameId, orientation }) {
  const { gameData, loading, error } = useFetchGameState(gameId);
  const customPieces = useChessPieces()

  const {
    game,
    result,
    winner,
    setGame,
    safeGameMutate,
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
  } = ChessGameLogic(gameData);

  const { resetGame, undoMove } = useControlsLogic(safeGameMutate, setGameOver, setResult, setWinner)

   if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="flex flex-col items-center">
      <Board orientation={orientation} position={game.fen()} onDrop={onDropHandler(game, setGame, checkGameOver)} customPieces={customPieces} />
      <Controls resetGame={resetGame} undoMove={undoMove} />
      <ResultNotice result={result} winner={winner} />
    </div>
  );
}
