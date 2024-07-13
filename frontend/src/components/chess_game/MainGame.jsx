'use client';

import { useState, useEffect } from 'react';
import Board from './Board';
import Controls from './Controls';
import ResultNotice from './ResultNotice';
import { ChessGameLogic } from '../../hooks/chessGameLogic';
import { useFetchGameState } from '../../hooks/useFetchGameState';
import { useChessPieces } from '../../hooks/useChessPieces';
import { useControlsLogic } from '../../hooks/useControlsLogic';
import { onDropHandler } from '../../utils/onDropHandler';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Chat } from '../../components/Chat';
import { GameUnavailable } from '@/components/chess_game/GameUnavailable';
import { Loading } from '@/components/Loading';
import { useChessTimers } from '@/hooks/useChessTimers';
import { useOpponentPresent } from '@/hooks/useOpponentPresent';

export default function MainGame({ gameId, orientation }) {
  const { gameData, loading, error } = useFetchGameState(gameId);
  const customPieces = useChessPieces();

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
  const username = "Alex";

  // WEBSOCKET FUNCTIONALITY
  const {
    messageHistory, 
    currentMessage,
    setCurrentMessage,
    handleSendMessage,
    moveHistory, 
    currentMove,
    opponentJoined,
    setCurrentMove,
    handleSendMove,
    readyState 
  } = useWebSocket(WS_URL, username, gameId, orientation);

  const opponentPresent = useOpponentPresent(gameData, orientation, opponentJoined)

  // CHESS GAME LOGIC
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
  } = ChessGameLogic(gameData, moveHistory, currentMove, setCurrentMove, handleSendMove);

  const { resetGame, undoMove } = useControlsLogic(safeGameMutate, setGameOver, setResult, setWinner);

  // Use the custom hook for timers
  const { whiteTime, blackTime, currentTurn } = useChessTimers(currentMove, gameData);

  if (loading) return <Loading />;
  if (error) return <GameUnavailable />;

  console.log(opponentPresent);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    {!opponentPresent && (
      <div className="animate-flash text-2xl font-bold text-red-500 dark:text-red-300 mb-4">
        Waiting for opponent to connect...
      </div>
    )}
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
      <div className="flex flex-col items-center">
        <h2 className={`text-2xl font-bold mb-4 ${currentTurn === 'white' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
          {currentTurn === 'white' ? 'White to Move' : 'Black to Move'}
        </h2>
        <div className="flex justify-between w-full mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">White</p>
            <p className="text-gray-900 dark:text-gray-100">{Math.floor(whiteTime / 60)}:{('0' + (whiteTime % 60)).slice(-2)}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Black</p>
            <p className="text-gray-900 dark:text-gray-100">{Math.floor(blackTime / 60)}:{('0' + (blackTime % 60)).slice(-2)}</p>
          </div>
        </div>
        <Board orientation={orientation} position={game.fen()} onDrop={onDropHandler(game, setGame, checkGameOver, handleSendMove, orientation)} customPieces={customPieces} />
        <Controls resetGame={resetGame} undoMove={undoMove} />
        <ResultNotice result={result} winner={winner} />
      </div>
    </div>
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <Chat 
        username={username}
        messageHistory={messageHistory} 
        currentMessage={currentMessage} 
        setCurrentMessage={setCurrentMessage} 
        handleSendMessage={handleSendMessage} 
        readyState={readyState} 
      /> 
    </div>
  </div>
  );
}
