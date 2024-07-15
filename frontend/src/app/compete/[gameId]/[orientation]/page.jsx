import ErrorBoundary from '@/components/ErrorBoundary';
import { MainGame } from '@/components/chess_game/MainGame';

export default function Page({ params }) {
  const { gameId, orientation } = params;
  
  
  return (
      <div>
        <MainGame gameId={gameId} orientation={orientation} />
      </div>
  );
}
