'use client';

import Board from './Board';
import Controls from './Controls';
import ResultNotice from './ResultNotice';
import { ChessGameLogic } from '../../hooks/ChessGameLogic';
import { useFetchGameState } from '../../hooks/useFetchGameState';
import { useChessPieces } from '../../hooks/useChessPieces';
import { useControlsLogic } from '../../hooks/useControlsLogic';
import { onDropHandler } from '../../utils/onDropHandler';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Chat } from '../../components/Chat';

export default function MainGame({ gameId, orientation }) {
  const { gameData, loading, error } = useFetchGameState(gameId);
  const customPieces = useChessPieces()

  const WS_URL = process.env.NEXT_PUBLIC_WS_CHAT_URL;
  const username = "Alex";

  // WEBSOCKET FUNCTIONALITY
  const {
    messageHistory, 
    currentMessage,
    setCurrentMessage,
    handleSendMessage,
    moveHistory, 
    currentMove,
    setCurrentMove,
    handleSendMove,
    readyState } = useWebSocket(WS_URL, username, gameId, orientation);

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

  const { resetGame, undoMove } = useControlsLogic(safeGameMutate, setGameOver, setResult, setWinner)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col items-center">
          <Board orientation={orientation} position={game.fen()} onDrop={onDropHandler(game, setGame, checkGameOver, handleSendMove)} customPieces={customPieces} />
          <Controls resetGame={resetGame} undoMove={undoMove} />
          <ResultNotice result={result} winner={winner} />
        </div>
      </div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
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
