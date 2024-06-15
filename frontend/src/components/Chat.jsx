'use client';

import useWebSocket from "react-use-websocket";

export default function Chat() {

  const WS_URL = process.env.NEXT_PUBLIC_WS_CHAT_URL;
  useWebSocket(WS_URL, {
    queryParams: "Alex"
  });

  return <h1>Hello, Alex</h1>
} 