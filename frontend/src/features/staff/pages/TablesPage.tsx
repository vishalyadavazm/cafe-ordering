import { useState } from "react";
import { TABLE_STATES } from "@/lib/mockData";

const LABEL: Record<string, string> = { available: "Available", occupied: "Occupied", ordering: "Ordering", preparing: "Preparing", ready: "Ready to Serve" };

export function TablesPage() {
  const [tables] = useState(TABLE_STATES);
  return (
    <>
      <div className="page-head"><div><div className="eyebrow">Floor</div><h2>Tables</h2><p>25 tables · {tables.filter((t) => t.status !== "available").length} active right now.</p></div></div>
      <div className="tbl-grid">
        {tables.map((t) => (
          <div className="tcard" key={t.n}>
            <div className="tn">{String(t.n).padStart(2, "0")}</div>
            <div className={"tstat st-" + t.status}><span className="tdot" />{LABEL[t.status]}</div>
            <div className="cap">{t.status === "available" ? "Ready for guests" : `Occupied · ${t.since}`}</div>
          </div>
        ))}
      </div>
    </>
  );
}
