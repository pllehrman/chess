'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadyState } from 'react-use-websocket';
import { reconnectWebSocket } from '../utils/reconnectWebsocket';

export const useChat = (WS_URL, username, gameId) => {
    const [messageHistory, setMessageHistory] = useState([])
    const [currentMessage, setCurrentMessage] = useState('');
    const { sendMessage, readyState, lastMessage, handleReconnection } = reconnectWebSocket(WS_URL, username, gameId);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            // Convert buffer to string
            if (messageData.message && messageData.message.type === 'Buffer') {
                messageData.message = String.fromCharCode(...messageData.message.data);
            }
            setMessageHistory((prev) => [...prev, messageData]);
            }
        }, [lastMessage]);
    
    useEffect(() => {
        if (readyState === ReadyState.CLOSED) {
            handleReconnection();
        }
    }, [readyState, handleReconnection]);
    

    const handleSendMessage = useCallback(() => {
        if (currentMessage) {
            sendMessage(currentMessage);
            setCurrentMessage('');
        }
    }, [currentMessage, sendMessage]);

    return {
        messageHistory,
        currentMessage,
        setCurrentMessage,
        handleSendMessage,
        readyState
    };
};