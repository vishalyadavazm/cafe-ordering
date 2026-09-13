import { Download, Printer, RefreshCw } from "lucide-react";
import { FakeQR } from "@/components/common/FakeQR";

export function QRCodesPage() {
  return (
    <>
      <div className="page-head">
        <div><div className="eyebrow">Setup</div><h2>QR Codes</h2><p>Each table's QR opens the menu and identifies the table automatically.</p></div>
        <button className="btn btn-primary" style={{ padding: "11px 16px", fontSize: 14 }}><Download size={16} /> Download all</button>
      </div>
      <div className="qr-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
          <div className="qr-card" key={n}>
            <FakeQR seed={n * 7 + 3} size={110} />
            <div style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 600, marginTop: 8 }}>Table {String(n).padStart(2, "0")}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }} className="mono">brew.cafe/t/{n}</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
              <button className="tiny-btn"><Download size={13} /> Save</button>
              <button className="tiny-btn"><Printer size={13} /> Print</button>
              <button className="tiny-btn"><RefreshCw size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
