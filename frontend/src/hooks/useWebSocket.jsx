'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadyState } from 'react-use-websocket';
import { reconnectWebSocket } from '../utils/reconnectWebsocket';

export const useWebSocket = (WS_URL, username, gameId, orientation) => {
    const [messageHistory, setMessageHistory] = useState([])
    const [currentMessage, setCurrentMessage] = useState('');
    const [moveHistory, setMoveHistory] = useState([]);
    const [currentMove, setCurrentMove] = useState(null);
    const { sendMessage, readyState, lastMessage, handleReconnection } = reconnectWebSocket(WS_URL, username, gameId, orientation);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            // Convert buffer to string
            if (messageData.message && messageData.message.type === 'Buffer') {
                messageData.message = String.fromCharCode(...messageData.message.data);
            }
            if (messageData.type === 'chat') {
                setMessageHistory((prev) => [...prev, messageData]);
            } else if (messageData.type === 'move') {
                setMoveHistory((prev) => [...prev, messageData]);
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

    const handleSendMove = useCallback((move) => {
        const moveData = JSON.stringify({type: 'move', move});
        sendMessage(moveData);
        setCurrentMove(null);
    }, [sendMessage]);

    return {
        messageHistory,
        currentMessage,
        setCurrentMessage,
        handleSendMessage,
        moveHistory, 
        currentMove,
        setCurrentMove,
        handleSendMove,
        readyState
    };
};