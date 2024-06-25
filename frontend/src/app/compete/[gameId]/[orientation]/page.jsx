'use client';

import MainGame from '../../../../components/chess_game/MainGame';
import { usePathname } from 'next/navigation';
import { Chat } from "../../../../components/Chat";

export default function SoloChessBoard() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/')
  const orientation = pathSegments.pop();
  const gameId = pathSegments.pop();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <MainGame gameId={gameId} orientation={orientation} />
      </div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <Chat />
      </div>
    </div>
  );
}