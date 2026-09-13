import { useMemo, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { KCOLS, rupee } from "@/lib/mockData";
import { useMockOrders } from "@/store/mockOrders";
import { OrderDetail } from "@/features/staff/components/OrderDetail";

export function LiveOrdersPage() {
  const orders = useMockOrders((s) => s.orders);
  const advance = useMockOrders((s) => s.advance);
  const reject = useMockOrders((s) => s.reject);
  const [detail, setDetail] = useState<number | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { new: 0, accepted: 0, preparing: 0, ready: 0, served: 0 };
    orders.forEach((o) => { if (c[o.status] != null) c[o.status]++; });
    return c;
  }, [orders]);

  const openOrder = orders.find((o) => o.id === detail);

  return (
    <>
      <div className="page-head">
        <div><div className="eyebrow">Kitchen · real-time</div><h2>Live Orders</h2><p>Move a ticket through the stages as your kitchen works. New orders arrive automatically.</p></div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--muted)" }}>
          <span><b className="mono" style={{ color: "var(--ink)" }}>{counts.new + counts.accepted + counts.preparing}</b> in progress</span>
          <span><b className="mono" style={{ color: "var(--ink)" }}>{counts.ready}</b> ready</span>
        </div>
      </div>
      <div className="kanban">
        {KCOLS.map((col) => {
          const list = orders.filter((o) => o.status === col.key).sort((a, b) => a.id - b.id);
          return (
            <div className="kcol" key={col.key}>
              <div className="kcol-head">
                <div className="t"><span className="dotc" style={{ background: col.color }} />{col.label}</div>
                <span className="cnt">{list.length}</span>
              </div>
              <div className="kcol-list">
                {list.length === 0 && <div className="empty-col">Nothing here</div>}
                {list.map((o) => (
                  <div key={o.id} className={"docket s-" + o.status} onClick={() => setDetail(o.id)}>
                    <div className="dk-top">
                      <span className="dk-order">#{o.id}</span>
                      <span className="dk-time">{o.time}</span>
                    </div>
                    <div className="dk-table"><MapPin size={12} /> Table {o.table}</div>
                    <div className="dk-items">
                      {o.items.map((it, i) => (<div className="dk-item" key={i}><span className="nm">{it.name}</span><span className="q">×{it.qty}</span></div>))}
                    </div>
                    <div className="dk-foot">
                      <span className="dk-total">{rupee(o.total)}</span>
                      <span className={"paid-tag " + (o.payment === "Paid" ? "paid" : "cash")}>{o.payment === "Paid" ? "PAID" : "CASH"}</span>
                    </div>
                    {col.act ? (
                      <div style={{ display: "flex", gap: 7 }}>
                        {col.key === "new" && (
                          <button className="dk-act" style={{ background: "var(--danger)", flex: "0 0 auto", width: 38 }} onClick={(e) => { e.stopPropagation(); reject(o.id); }} title="Reject">
                            <X size={15} />
                          </button>
                        )}
                        <button className={"dk-act a-" + col.key} onClick={(e) => { e.stopPropagation(); advance(o.id, col.next); }}>
                          {col.key === "new" && <Check size={14} />}{col.act}
                        </button>
                      </div>
                    ) : <div className="dk-done"><Check size={13} style={{ verticalAlign: -2 }} /> Completed</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="hint">Place an order from the customer flow (open a table's QR link) and watch it drop into "New Orders".</div>
      {openOrder && <OrderDetail order={openOrder} onClose={() => setDetail(null)} advance={advance} />}
    </>
  );
}
