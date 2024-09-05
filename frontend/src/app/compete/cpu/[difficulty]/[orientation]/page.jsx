import { ComputerGame } from "@/components/game/ComputerGame";

export default function Page({ params }) {
  const { difficulty, orientation } = params;

  return (
    <>
      <ComputerGame difficulty={difficulty} orientation={orientation} />
    </>
  );
}
