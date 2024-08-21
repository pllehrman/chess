"use client";

import { useState, useEffect, useCallback } from "react";
import { reconnectWebSocket } from "./reconnectWebsocket";

export const useWebSocket = (
  sessionId,
  sessionUsername,
  gameId,
  orientation,
  gameData
) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [moveHistory, setMoveHistory] = useState([]);
  const [twoPeoplePresent, setTwoPeoplePresent] = useState(
    gameData.numPlayers === 1
  );
  const [whiteTime, setWhiteTime] = useState(gameData.playerWhiteTimeRemaining);
  const [blackTime, setBlackTime] = useState(gameData.playerBlackTimeRemaining);
  const [currentTurn, setCurrentTurn] = useState(
    getCurrentTurnFromFEN(gameData.fen)
  );

  const { sendMessage, readyState, lastMessage } = reconnectWebSocket(
    sessionId,
    sessionUsername,
    gameId,
    orientation
  );

  // Determines the kind of incoming ws message and handles accordingly
  const handleMessage = useCallback((messageData) => {
    switch (messageData.type) {
      case "chat":
        setMessageHistory((prev) => [...prev, messageData]);
        break;
      case "move":
        incomingMove(messageData.message);
        break;
      case "capacityUpdate":
        setTwoPeoplePresent(messageData.message.capacity === 2);
        updateTime(gameId, whiteTime, blackTime);
        break;
      default:
        console.warn(`Unhandled message type: ${messageData.type}`);
    }
  }, []);

  // Process the new incoming ws message
  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      handleMessage(messageData);
    }
  }, [lastMessage]);

  // Handle 'move' message
  const incomingMove = useCallback(({ move, whiteTime, blackTime }) => {
    setMoveHistory((prev) => [...prev, move]);
    setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
    setWhiteTime(whiteTime);
    setBlackTime(blackTime);
  }, []);

  // Send chat message
  const sendChat = useCallback(() => {
    if (currentMessage) {
      sendMessage(JSON.stringify({ type: "chat", message: currentMessage }));
      setCurrentMessage("");
    }
  }, [sendMessage]);

  // Send move message
  const sendMove = useCallback(
    (move, fen, whiteTime, blackTime) => {
      sendMessage(
        JSON.stringify({ type: "move", move, fen, whiteTime, blackTime })
      );
      setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
    },
    [sendMessage]
  );

  const updateTime = useCallback(async (gameId, whiteTime, blackTime) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}`,
        {
          method: "PATCH", // Use PATCH to update partial fields
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            whiteTime,
            blackTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update game times");
      }

      const data = await response.json();
      console.log("Game updated successfully:", data);
    } catch (error) {
      console.error("Error updating game times:", error.message);
    }
  }, []);

  return {
    messageHistory,
    currentMessage,
    setCurrentMessage,
    sendChat,
    moveHistory,
    twoPeoplePresent,
    sendMove,
    readyState,
    whiteTime,
    setWhiteTime,
    blackTime,
    setBlackTime,
    currentTurn,
    setMoveHistory,
  };
};

const getCurrentTurnFromFEN = (fen) => {
  const parts = fen.split(" ");
  if (parts.length > 1) {
    return parts[1] === "w" ? "white" : "black";
  }
  return "white";
};
