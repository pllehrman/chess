'use client';

import { useState, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ChessComponent({ gameId }) { // Pass gameId as a prop
  const [game, setGame] = useState(new Chess());
  const [gameOver, setGameOver] = useState(false);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = new Chess(g.fen()); // Create a new Chess instance with the current position
      modify(update);
      return update;
    });
  }

  function checkGameOver() {
    if (game.isCheckmate()) {
      setGameOver(true);
      return 'checkmate';
    } else if (game.isDraw()) {
      setGameOver(true);
      return 'draw';
    } else if (game.isStalemate()) {
      setGameOver(true);
      return 'stalemate';
    } else if (game.isThreefoldRepetition()) {
      setGameOver(true);
      return 'threefold repetition';
    } else if (game.isInsufficientMaterial()) {
      setGameOver(true);
      return 'insufficient material';
    } else {
      return null;
    }
  }

  async function onDrop(sourceSquare, targetSquare) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for simplicity
    });

    if (move === null) {
      console.error(`Invalid move: ${JSON.stringify({ from: sourceSquare, to: targetSquare })}`);
      return false; // Illegal move
    }

    // Update the game state with the new position
    const updatedGame = new Chess(game.fen());
    setGame(updatedGame);

    // Check if the game is over
    const result = checkGameOver();
    if (result) {
      // Send the final game state to the backend
      try {
        await axios.put(`${apiUrl}/games/${gameId}`, {
          fen: updatedGame.fen(),
          result: result,
        });
      } catch (error) {
        console.error('Error updating game on the backend:', error);
      }
    }

    return true; // Legal move
  }

  const pieces = [
    'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
    'bP', 'bN', 'bB', 'bR', 'bQ', 'bK',
  ];

  const customPieces = useMemo(() => {
    const pieceComponents = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
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

  const boardWrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '4px',
    backgroundColor: '#779952',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="StyledBoard"
        boardOrientation="black"
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        }}
        customDarkSquareStyle={{ backgroundColor: '#779952' }}
        customLightSquareStyle={{ backgroundColor: '#edeed1' }}
        customPieces={customPieces}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          setGameOver(false);
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
        }}
      >
        undo
      </button>
    </div>
  );
}
