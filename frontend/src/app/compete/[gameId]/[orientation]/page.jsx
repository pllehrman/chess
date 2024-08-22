import { checkForCookie } from "@/components/formatting/checkForCookie";
import { MainGame } from "@/components/game/MainGame";

export default function Page({ params }) {
  const { gameId, orientation } = params;

  return (
    <div>
      <MainGame gameId={gameId} orientation={orientation} />
    </div>
  );
}
