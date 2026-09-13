const ROWS: [string, string][] = [
  ["Cafe name", "Brew Cafe"],
  ["Currency", "₹ INR"],
  ["GST rate", "5%"],
  ["Default prep time", "20 min"],
  ["New-order sound", "On"],
  ["Auto-accept orders", "Off"],
];

export function SettingsPage() {
  return (
    <>
      <div className="page-head"><div><div className="eyebrow">Configuration</div><h2>Settings</h2><p>Manage how the ordering system behaves.</p></div></div>
      <div className="panel" style={{ maxWidth: 560 }}>
        {ROWS.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "13px 4px", borderBottom: i < ROWS.length - 1 ? "1px dashed var(--line)" : "none" }}>
            <span style={{ color: "var(--ink2)", fontSize: 14 }}>{r[0]}</span><b style={{ fontSize: 14 }}>{r[1]}</b>
          </div>
        ))}
      </div>
    </>
  );
}
