import { HighlightSchedule, Popular, Topbar } from "@/components";

export default function page() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <HighlightSchedule />
      <Popular />
    </div>
  );
}
