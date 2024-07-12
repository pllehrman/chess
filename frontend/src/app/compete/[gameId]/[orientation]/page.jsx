'use client';

import MainGame from '../../../../components/chess_game/MainGame';
import { usePathname } from 'next/navigation';
import { checkGameAvailability } from '../../../../utils/checkGameAvailability';
import { useEffect, useState, useRef } from 'react';
import { GameUnavailable } from '@/components/chess_game/GameUnavailable';
import { Loading } from '@/components/Loading';

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
    return <Loading />
  }

  if (!isGameAvailable) {
    return <GameUnavailable />
  }

  return (
    <div>
      <MainGame gameId={gameId} orientation={orientation} />
    </div>
  );
}