'use client';

import MainGame from '../../../../components/chess_game/MainGame';
import { usePathname } from 'next/navigation';
import { checkGameAvailability } from '../../../../utils/checkGameAvailability';
import { useEffect, useState, useRef } from 'react';

export default function SoloChessBoard() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/')
  const orientation = pathSegments.pop();
  const gameId = pathSegments.pop();

  const [isGameAvailable, setIsGameAvailable] = useState(null);
  const hasCheckedAvailability = useRef(false);

  useEffect(() => {
    const fetchGameAvailability = async () => {
      const available = await checkGameAvailability(gameId, orientation);
      console.log(available)
      setIsGameAvailable(available);
      hasCheckedAvailability.current = true;
    }
    
    if(!hasCheckedAvailability.current) {
      fetchGameAvailability();
    }
  },[gameId]);

  if (isGameAvailable === null) {
    return <h1>Loading...</h1>
  }

  if (!isGameAvailable) {
    return <h1>Game is unavailable</h1>
  }

  return (
    <div>
      <MainGame gameId={gameId} orientation={orientation} />
    </div>
  );
}