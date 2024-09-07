"use client";

import { useState, useEffect, useCallback } from "react";
import { reconnectWebSocket } from "./reconnectWebsocket";

export const useWebSocket = (
  sessionId,
  sessionUsername,
  gameData,
  orientation,
  whiteTime,
  blackTime,
  setWhiteTime,
  setBlackTime,
  twoPeoplePresent,
  setTwoPeoplePresent
  // setOpponentUsername
) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [moveHistory, setMoveHistory] = useState([]);

  const { sendMessage, readyState, lastMessage } = reconnectWebSocket(
    sessionId,
    sessionUsername,
    gameData.id,
    gameData.type,
    orientation
  );

  // Determines the kind of incoming ws message and handles accordingly
  const handleMessage = useCallback((messageData) => {
    switch (messageData.type) {
      case "chat":
        setMessageHistory((prev) => [...prev, messageData]);
        break;
      case "move":
        setMoveHistory((prev) => [...prev, messageData.message.move]);
        setWhiteTime(messageData.message.whiteTime);
        setBlackTime(messageData.message.blackTime);
        break;
      case "capacityUpdate":
        if (gameData.type === "pvp") {
          const newTwoPeoplePresent = messageData.message.capacity === 2;

          // Only update if the value changes
          if (twoPeoplePresent !== newTwoPeoplePresent) {
            console.log("changing two people present");
            setTwoPeoplePresent((prev) => newTwoPeoplePresent);
          }
        }
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
  // const incomingMove = useCallback(({ move, whiteTime, blackTime }) => {
  //   console.log(move);

  //   // Use safeGameMutate to update the game state safely
  //   safeGameMutate((updatedGame) => {
  //     const move = updatedGame.move({
  //       from: move.from,
  //       to: move.to,
  //       promotion: move.promotion || "q", // Ensure promotion defaults to a queen
  //     });

  //     if (!move) {
  //       console.error("Invalid move received:", move);
  //     } else {
  //       console.log("Move applied successfully:", result);
  //     }
  //   });

  //   setMoveHistory((prev) => [...prev, move]);

  //   setWhiteTime(whiteTime);
  //   setBlackTime(blackTime);
  // }, []);

  const sendChat = useCallback(() => {
    if (currentMessage) {
      const chatMessage = {
        type: "chat",
        message: currentMessage,
        fromMe: true,
      };
      setMessageHistory((prev) => [...prev, chatMessage]);
      sendMessage(JSON.stringify(chatMessage));

      setCurrentMessage("");
    }
  }, [sendMessage, currentMessage, setMessageHistory]);

  // Send move message
  const sendMove = useCallback(
    (move, fen, whiteTime, blackTime) => {
      sendMessage(
        JSON.stringify({ type: "move", move, fen, whiteTime, blackTime })
      );
      // setCurrentTurn((prev) => (prev === "white" ? "black" : "white"));
    },
    [sendMessage]
  );

  // const updateTime = useCallback(async (gameId, whiteTime, blackTime) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}`,
  //       {
  //         method: "PATCH", // Use PATCH to update partial fields
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           whiteTime,
  //           blackTime,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update game times");
  //     }

  //     const data = await response.json();
  //     console.log("Game updated successfully:", data);
  //   } catch (error) {
  //     console.error("Error updating game times:", error.message);
  //   }
  // }, []);

  return {
    messageHistory,
    currentMessage,
    setCurrentMessage,
    sendChat,
    moveHistory,
    sendMove,
    readyState,
    setMoveHistory,
  };
};
