import useWebSocket, {ReadyState} from "react-use-websocket";

export const reconnectWebSocket = (WS_URL, username, maxRetries = 3) => {
    let retryCount = 0;

    const connect = () => {
        const { sendMessage, readyState, connect, lastMessage } = useWebSocket(WS_URL, {
            queryParams: { username },
            shouldReconnect: () => retryCount < maxRetries
        });

        const handleReconnection = () => {
            if (readyState === ReadyState.CLOSED && retryCount < maxRetries) {
                console.log(`Attempting to reconnect... (${retryCount + 1}/${maxRetries})`);
                retryCount += 1;
                // connect();
            }
        };

        return {
            sendMessage,
            readyState,
            lastMessage,
            handleReconnection
        };
    };
    
    return connect();
}; 