// components/chess_game/MainGameClient.jsx
'use client';

import Board from './Board';
import Controls from './Controls';
import ResultNotice from './ResultNotice';
import { Timers } from './Timers'
import { ChessGameLogic } from '../../hooks/chessGameLogic';
import { useChessPieces } from '../../hooks/useChessPieces';
import { useControlsLogic } from '../../hooks/useControlsLogic';
import { onDropHandler } from '../../utils/onDropHandler';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Chat } from '../../components/Chat';
import { useChessTimers } from '@/hooks/useChessTimers';
import { updateChessTimers } from '@/hooks/updateChessTimers';

export function MainGameClient({ gameData, orientation }) {
  const customPieces = useChessPieces();
  const {whiteTime, setWhiteTime, blackTime, setBlackTime, currentTurn, setCurrentTurn} = useChessTimers(gameData);
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
  const username = "Alex";
  
//  Need to add current move
  const {
    messageHistory, 
    currentMessage,
    setCurrentMessage,
    handleSendMessage,
    moveHistory, 
    twoPeoplePresent, 
    handleSendMove,
    readyState,
  } = useWebSocket(WS_URL, username, gameData.id, orientation, gameData, setCurrentTurn);

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
  } = ChessGameLogic(gameData, moveHistory);

  const { resetGame, undoMove } = useControlsLogic(safeGameMutate, setGameOver, setResult, setWinner);

  console.log("current turn:", currentTurn)
  updateChessTimers(setWhiteTime, setBlackTime, gameData.timeIncrement, currentTurn, twoPeoplePresent);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      {!twoPeoplePresent && (
        <div className="animate-flash text-2xl font-bold text-red-500 dark:text-red-300 mb-4">
          Waiting for opponent to connect...
        </div>
      )}
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col items-center">
          <h2 className={`text-2xl font-bold mb-4 ${currentTurn === 'white' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
            {currentTurn === 'white' ? 'White to Move' : 'Black to Move'}
          </h2>
          <Timers whiteTime={whiteTime} blackTime={blackTime}/>
          <Board orientation={orientation} position={game.fen()} onDrop={onDropHandler(game, setGame, checkGameOver, handleSendMove, orientation, whiteTime, blackTime)} customPieces={customPieces} />
          <Controls resetGame={resetGame} undoMove={undoMove} />
          <ResultNotice result={result} winner={winner} />
        </div>
      </div>
      <Chat username={username} messageHistory={messageHistory} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} 
        handleSendMessage={handleSendMessage} readyState={readyState} /> 
    </div>
  );
}
