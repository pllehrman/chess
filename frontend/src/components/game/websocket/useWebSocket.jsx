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
  setTwoPeoplePresent
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

  const handleMessage = (messageData) => {
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
          setTwoPeoplePresent((prev) => {
            if (prev && messageData.message.capacity == 1) {
              console.log(
                "updating time on the frontend!",
                whiteTime,
                blackTime
              );
              sendTimeUpdate(whiteTime, blackTime);
            }
            return messageData.message.capacity == 2;
          });
        }
        break;
      default:
        console.warn(`Unhandled message type: ${messageData.type}`);
    }
  };

  // Process the new incoming ws message
  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      handleMessage(messageData);
    }
  }, [lastMessage]);

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

  const sendTimeUpdate = useCallback(
    (whiteTime, blackTime) => {
      sendMessage(JSON.stringify({ type: "timeUpdate", whiteTime, blackTime }));
    },
    [sendMessage]
  );

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
