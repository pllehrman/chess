'use client';

import useWebSocket from "react-use-websocket";

export default function Chat() {

  const WS_URL = "ws://localhost:3003";
  useWebSocket(WS_URL, {
    queryParams: "Alex"
  });

  return <h1>Hello, Alex</h1>
} 