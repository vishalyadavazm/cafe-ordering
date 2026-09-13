import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Circle } from "lucide-react";
import { CAFE } from "@/lib/mockData";
import { useMockOrders } from "@/store/mockOrders";
import { CountRing } from "@/features/customer/components/CountRing";

const STEPS = [
  { k: "placed", label: "Order Placed", sub: "We got your order" },
  { k: "payment", label: "Payment Confirmed", sub: "Paid" },
  { k: "accepted", label: "Cafe Accepted", sub: "Kitchen confirmed" },
  { k: "preparing", label: "Preparing", sub: "Chef is on it" },
  { k: "ready", label: "Ready", sub: "Freshly plated" },
  { k: "served", label: "Served", sub: "Enjoy your meal" },
];

const RANK: Record<string, number> = { new: 2, accepted: 3, preparing: 4, ready: 5, served: 6 };

export function TrackOrderPage() {
  const navigate = useNavigate();
  const { session } = useParams<{ session: string }>();
  const order = useMockOrders((s) => s.orders.find((o) => o.id === Number(session)));

  if (!order) {
    return (
      <div className="customer-app">
        <div className="screen"><div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Order not found.</div></div>
      </div>
    );
  }

  const cur = RANK[order.status];
  const isReady = order.status === "ready" || order.status === "served";
  const steps = STEPS.map((st, i) => (i === 1 ? { ...st, sub: order.payment === "Cash" ? "Pay at counter" : "Paid online" } : st));

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="subhead">
          <button className="icon-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <div><h2 style={{ fontSize: 18 }}>Order #{order.id}</h2><div style={{ fontSize: 12, color: "var(--muted)" }}>Table #{CAFE.table}</div></div>
        </div>
        <div className="screen-scroll">
          <div className="track">
            {isReady ? (
              <div className="track-hero">
                <div style={{ fontSize: 44, position: "relative", zIndex: 2 }}>🎉</div>
                <h2 style={{ color: "#FBF6EA", fontSize: 24, marginTop: 6, position: "relative", zIndex: 2 }}>Your order is ready!</h2>
                <p style={{ color: "rgba(243,238,223,.8)", fontSize: 14, marginTop: 8, position: "relative", zIndex: 2 }}>
                  Our waiter will serve it at <b>Table #{CAFE.table}</b>.
                </p>
              </div>
            ) : (
              <div className="track-hero">
                <div className="eyebrow" style={{ color: "rgba(243,238,223,.65)", position: "relative", zIndex: 2 }}>Your food is being prepared</div>
                <CountRing status={order.status} />
                <p style={{ color: "rgba(243,238,223,.78)", fontSize: 13, position: "relative", zIndex: 2 }}>Please relax — we'll notify you when it's ready.</p>
              </div>
            )}
            <div className="timeline">
              {steps.map((st, i) => {
                const stepRank = i + 1;
                const done = stepRank < cur;
                const active = stepRank === cur;
                return (
                  <div className="tl-step" key={st.k}>
                    <div className="tl-mark">
                      <div className={"tl-dot " + (done ? "done" : active ? "active" : "")}>
                        {done ? <Check size={15} /> : active ? <Circle size={9} fill="#fff" /> : <span style={{ fontSize: 11 }}>{stepRank}</span>}
                      </div>
                      {i < steps.length - 1 && <div className={"tl-line " + (done ? "done" : "")} />}
                    </div>
                    <div className="tl-body">
                      <b style={{ color: done || active ? "var(--ink)" : "var(--muted)" }}>{st.label}</b>
                      <small>{active ? "In progress…" : st.sub}</small>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hint">Tip: open the staff dashboard in another tab and advance this order — it updates here live.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
