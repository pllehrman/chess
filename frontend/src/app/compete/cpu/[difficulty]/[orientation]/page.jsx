import { ComputerGame } from "@/components/game/ComputerGame";

export default function Page({ params }) {
  const { difficulty, orienation } = params;

  return (
    <>
      <ComputerGame difficulty={difficulty} orienation={orienation} />
    </>
  );
}
