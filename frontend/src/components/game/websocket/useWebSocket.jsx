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
  setTwoPeoplePresent,
  setError,
  setResult,
  setWinner,
  setIncomingDrawOffer,
  setOutgoingDrawOffer
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
    console.log(messageData);
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
              sendTimeUpdate(whiteTime, blackTime);
            }
            return messageData.message.capacity == 2;
          });
        }
        break;
      case "gameOver":
        console.log(messageData.message.winner);
        setResult(messageData.message.result);
        setWinner(messageData.message.winner);

        break;
      case "drawOffer":
        if (messageData.message.answer != null) {
          setOutgoingDrawOffer(false);
        } else {
          setIncomingDrawOffer(true);
        }
        break;
      case "error":
        setError(messageData.message);
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
    if (!currentMessage) return;

    const baseMessage = {
      type: "chat",
      message: currentMessage,
    };

    // Add the message to your own message history
    setMessageHistory((prev) => [
      ...prev,
      { message: { ...baseMessage, fromMe: true } },
    ]);

    // Send the message to the opponent
    sendMessage(JSON.stringify({ ...baseMessage, fromMe: false }));

    // Clear the current message
    setCurrentMessage("");
  }, [sendMessage, currentMessage, setMessageHistory]);

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

  const sendGameOver = useCallback(
    (winner, result, whiteTime, blackTime) => {
      sendMessage(
        JSON.stringify({
          type: "gameOver",
          winner,
          result,
          whiteTime,
          blackTime,
        })
      );
    },
    [sendMessage]
  );

  const sendDrawOffer = useCallback((answer) => {
    // action is either a "request" or "response" answer is either true or false in accepting the offer
    sendMessage(JSON.stringify({ type: "drawOffer", answer: answer }));
  });

  return {
    messageHistory,
    currentMessage,
    setCurrentMessage,
    sendChat,
    moveHistory,
    sendMove,
    readyState,
    setMoveHistory,
    sendGameOver,
    sendDrawOffer,
  };
};
