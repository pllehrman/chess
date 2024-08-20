import { History } from "@/components/history/History";

export default function Page() {
  const { sessionId, sessionUsername } = retrieveCookie();
  return (
    <div>
      <History sessionId={sessionId} />
    </div>
  );
}
