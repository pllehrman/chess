'use client';

import MainGame from '../../../components/chess_game/MainGame';
import { usePathname } from 'next/navigation';

export default function SoloChessBoard() {
  const pathname = usePathname();
  const gameId = pathname.split('/').pop();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <MainGame gameId={gameId}/>
      </div>
    </div>
  );
}