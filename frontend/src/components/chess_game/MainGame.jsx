'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import Board from './Board';
import Controls from './Controls';
import ResultNotice from './ResultNotice';
import { ChessGameLogic } from '../../hooks/ChessGameLogic';
import fetchGameState from '../../hooks/fetchGameState';
import onDrop from '../../utils/onDrop';

export default function MainGame({ gameId }) {
  const [gameData, setGameData] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGameState(gameId);
        setGameData(data);
      } catch (error) {
        throw error;
      }
    };
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [gameId]);

  if (!gameData) {
    return <h1>Game is loading</h1>; // or some other fallback UI
  }
  
  console.log(gameData);
  const {
    game,
    setGame,
    gameOver,
    result,
    winner,
    safeGameMutate,
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
  } = ChessGameLogic(gameData);



  // const { ws, setGameRef } = ChessWebSocket(setGame, checkGameOver);

  // useEffect(() => {
  //   setGameRef(game);
  // }, [game, setGameRef]);



  const pieces = [
    'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
    'bP', 'bN', 'bB', 'bR', 'bQ', 'bK',
  ];

  const customPieces = useMemo(() => {
    const pieceComponents = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          className="bg-no-repeat bg-center"
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/${piece}.png)`,
            backgroundSize: '100%',
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Board game={game} onDrop={onDrop} customPieces={customPieces} />
      <Controls
        resetGame={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          setGameOver(false);
          setResult(null);
          setWinner(null);
        }}
        undoMove={() => {
          safeGameMutate((game) => {
            game.undo();
          });
        }}
      />
      <ResultNotice result={result} winner={winner} />
    </div>
  );
}
