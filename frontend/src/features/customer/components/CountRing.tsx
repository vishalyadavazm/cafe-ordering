import { useEffect, useState } from "react";
import type { OrderStatus } from "@/lib/mockData";

export function CountRing({ status }: { status: OrderStatus }) {
  const [mins, setMins] = useState(15);
  useEffect(() => {
    if (status !== "preparing" && status !== "accepted") return;
    const t = setInterval(() => setMins((m) => (m > 1 ? m - 1 : m)), 60000);
    return () => clearInterval(t);
  }, [status]);
  const pct = Math.min(1, (20 - mins) / 20);
  const r = 64, C = 2 * Math.PI * r;
  return (
    <div className="count-ring" style={{ position: "relative", zIndex: 2 }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="9" />
        <circle
          cx="75" cy="75" r={r} fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 1s" }}
        />
      </svg>
      <div className="cc"><div style={{ textAlign: "center" }}><div className="count-num">{mins}</div><div style={{ fontSize: 11, color: "rgba(243,238,223,.7)", letterSpacing: ".1em" }}>MIN LEFT</div></div></div>
    </div>
  );
}
