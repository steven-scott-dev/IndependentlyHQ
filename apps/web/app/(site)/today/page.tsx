"use client";
import { useEffect, useState } from "react";
type Mission = { id: string; title: string; description?: string; est_minutes: number };

export default function Today() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/missions/today").then(r => r.json()).then(setMission).finally(()=>setLoading(false));
  }, []);
  const complete = async () => {
    if (!mission) return;
    await fetch(`/api/missions/${mission.id}/complete`, { method: "POST" });
    alert("Completed! Check your streak on /api/me");
    location.reload();
  };
  if (loading) return <p>Loading…</p>;
  if (!mission) return <p>No mission available. Generate a plan first.</p>;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Today’s mission</h2>
      <div className="rounded border p-4">
        <div className="font-medium">{mission.title}</div>
        {mission.description && <p className="text-sm mt-2">{mission.description}</p>}
        <p className="text-xs mt-2">Est: {mission.est_minutes} min</p>
        <button onClick={complete} className="mt-4 rounded px-3 py-2 border">Mark complete</button>
      </div>
    </div>
  );
}
