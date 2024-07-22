'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadyState } from 'react-use-websocket';
import { reconnectWebSocket } from '../utils/reconnectWebsocket';

export const useWebSocket = (WS_URL, username, gameId, orientation, gameData) => {
    const [messageHistory, setMessageHistory] = useState([])
    const [currentMessage, setCurrentMessage] = useState('');
    const [moveHistory, setMoveHistory] = useState([]);
    const [twoPeoplePresent, setTwoPeoplePresent] = useState(false); //non-intuitively this should be set to true to ensure the logic works correctly
    const { sendMessage, readyState, lastMessage, handleReconnection } = reconnectWebSocket(WS_URL, username, gameId, orientation);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            // Convert buffer to string

            switch(messageData.type) {
                case 'chat':
                    setMessageHistory((prev) => [...prev, messageData]);
                    break;
                case 'move':
                    setMoveHistory((prev) => [...prev, messageData]);
                    break;
                case 'capacityUpdate':
                    setTwoPeoplePresent(messageData.message.capacity === 2);
                    break;
                default:
                    console.warn(`Unhandled message type: ${messageData.type}`);
            }
        }
    }, [lastMessage]);
    
    useEffect(() => {
        if (readyState === ReadyState.CLOSED) {
            handleReconnection();
        }
    }, [readyState, handleReconnection]);
    

    const handleSendMessage = useCallback(() => {
        if (currentMessage) {
            const messageData = JSON.stringify({ type: 'chat', message: currentMessage });
            sendMessage(messageData);
            setCurrentMessage('');
        }
    }, [currentMessage, sendMessage]);

    const handleSendMove = useCallback((move, fen, whiteTime, blackTime) => {
        const moveData = JSON.stringify({type: 'move', move, fen, whiteTime, blackTime});
        sendMessage(moveData);
    }, [sendMessage]);

    return {
        messageHistory,
        currentMessage,
        setCurrentMessage,
        handleSendMessage,
        moveHistory, 
        twoPeoplePresent,
        handleSendMove,
        readyState
    };
};