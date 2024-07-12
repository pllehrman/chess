'use client';

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

export default function MainGame({ gameId, orientation }) {
  const { gameData, loading, error } = useFetchGameState(gameId);
  const customPieces = useChessPieces()

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

  // IDEALLY THIS LINE IS CONDITIONALLY RENDERED BASED ON IF COMPUTER IS PLAYING
  const { whiteTime, blackTime, currentTurn } = useChessTimers(currentMove, gameData);

  if (loading) return <GameUnavailable />
  if (error) return <Loading />


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col items-center">
          <h2 className={`text-2xl font-bold mb-4 ${currentTurn === 'white' ? 'text-gray-900' : 'text-gray-400'}`}>
            {currentTurn === 'white' ? 'White to Move' : 'Black to Move'}
          </h2>
          <div className="flex justify-between w-full mb-4">
            <div className="text-center">
              <p className="text-lg font-bold">White</p>
              <p>{Math.floor(whiteTime / 60)}:{('0' + (whiteTime % 60)).slice(-2)}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Black</p>
              <p>{Math.floor(blackTime / 60)}:{('0' + (blackTime % 60)).slice(-2)}</p>
            </div>
          </div>
          <Board orientation={orientation} position={game.fen()} onDrop={onDropHandler(game, setGame, checkGameOver, 
                 handleSendMove, orientation)} customPieces={customPieces} />
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
