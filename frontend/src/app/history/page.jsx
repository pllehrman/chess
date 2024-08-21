import { History } from "@/components/history/History";
import { retrieveSession } from "@/components/formatting/retrieveSession";

export default function Page() {
  const { sessionId, sessionUsername } = retrieveSession();
  return (
    <div>
      <History sessionId={sessionId} />
    </div>
  );
}
