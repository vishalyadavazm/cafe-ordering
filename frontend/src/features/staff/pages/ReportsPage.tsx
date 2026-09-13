import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { POPULAR, TINT, WEEK, rupee } from "@/lib/mockData";

const SUMMARY: [string, string][] = [["Daily revenue", "₹42,850"], ["Weekly revenue", "₹3,21,400"], ["Orders (7d)", "842"], ["Avg. order value", "₹381"]];

export function ReportsPage() {
  return (
    <>
      <div className="page-head"><div><div className="eyebrow">Analytics</div><h2>Reports</h2><p>Performance at a glance.</p></div></div>
      <div className="stat-grid" style={{ marginBottom: 18 }}>
        {SUMMARY.map((s, i) => (
          <div className="stat" key={i}><div className="lab">{s[0]}</div><div className="val">{s[1]}</div></div>
        ))}
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Revenue this week</h3></div>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK} margin={{ top: 5, right: 6, left: -14, bottom: 0 }}>
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#8A7B6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8A7B6B" }} axisLine={false} tickLine={false} tickFormatter={(v) => "₹" + v / 1000 + "k"} />
                <Tooltip formatter={(v: number) => rupee(v)} contentStyle={{ borderRadius: 12, border: "1px solid #ECE1D0", fontSize: 12 }} />
                <Bar dataKey="r" fill="#1E5C48" radius={[7, 7, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Most ordered</h3></div>
          {POPULAR.map((p, i) => (
            <div className="pop-item" key={i}>
              <div className="pop-thumb" style={{ background: TINT[Object.keys(TINT)[i]] || "#f0e7d6" }}>{p.e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600 }}><span>{p.name}</span><span className="mono" style={{ color: "var(--muted)" }}>{p.n} sold</span></div>
                <div className="pop-bar"><i style={{ width: (p.n / POPULAR[0].n) * 100 + "%" }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
