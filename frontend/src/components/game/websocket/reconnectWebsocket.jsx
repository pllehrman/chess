import useWebSocket, { ReadyState } from "react-use-websocket";
import { useRef, useEffect } from 'react';

export const reconnectWebSocket = (username, gameId, orientation, maxRetries = 3) => {
  const retryCount = useRef(0);
  const { sendMessage, readyState, lastMessage, getWebSocket } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL, {
    queryParams: { username, gameId, orientation },
    shouldReconnect: (closeEvent) => retryCount.current < maxRetries,
    onClose: () => {
      if (readyState === ReadyState.CLOSED && retryCount < maxRetries) {
        retryCount.current += 1;
      }
    }
  });

  const handleReconnection = () => {
    if (readyState === ReadyState.CLOSED && retryCount.current < maxRetries) {
      retryCount.current += 1;
      getWebSocket();
    }
  };

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      handleReconnection();
    } 
  }, [readyState]);

  return {
    sendMessage,
    readyState,
    lastMessage,
    handleReconnection
  };
};
