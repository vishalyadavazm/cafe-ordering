import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, Circle } from "lucide-react";
import { getPublicOrder, type OrderStatus } from "@/features/customer/api";
import { CountRing } from "@/features/customer/components/CountRing";

const STEPS = [
  { k: "placed", label: "Order Placed", sub: "We got your order" },
  { k: "payment", label: "Payment Confirmed", sub: "Paid" },
  { k: "accepted", label: "Cafe Accepted", sub: "Kitchen confirmed" },
  { k: "preparing", label: "Preparing", sub: "Chef is on it" },
  { k: "ready", label: "Ready", sub: "Freshly plated" },
  { k: "served", label: "Served", sub: "Enjoy your meal" },
];

const RANK: Record<OrderStatus, number> = { NEW: 2, ACCEPTED: 3, PREPARING: 4, READY: 5, SERVED: 6, CANCELLED: 0 };

export function TrackOrderPage() {
  const navigate = useNavigate();
  const { session } = useParams<{ session: string }>();
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["track", session],
    queryFn: () => getPublicOrder(session!),
    enabled: !!session,
    refetchInterval: 4000,
  });

  if (isLoading) {
    return <div className="customer-app"><div className="screen"><div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Loading…</div></div></div>;
  }
  if (isError || !order) {
    return <div className="customer-app"><div className="screen"><div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Order not found.</div></div></div>;
  }

  const cur = RANK[order.status];
  const isReady = order.status === "READY" || order.status === "SERVED";
  const isActive = order.status === "PREPARING" || order.status === "ACCEPTED";
  const steps = STEPS.map((st, i) => (i === 1 ? { ...st, sub: order.payment_status === "PAID" ? "Paid online" : "Pay at counter" } : st));

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="subhead">
          <button className="icon-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <div><h2 style={{ fontSize: 18 }}>Order #{order.order_number}</h2>{order.table_number != null && <div style={{ fontSize: 12, color: "var(--muted)" }}>Table #{order.table_number}</div>}</div>
        </div>
        <div className="screen-scroll">
          <div className="track">
            {isReady ? (
              <div className="track-hero">
                <div style={{ fontSize: 44, position: "relative", zIndex: 2 }}>🎉</div>
                <h2 style={{ color: "#FBF6EA", fontSize: 24, marginTop: 6, position: "relative", zIndex: 2 }}>Your order is ready!</h2>
                <p style={{ color: "rgba(243,238,223,.8)", fontSize: 14, marginTop: 8, position: "relative", zIndex: 2 }}>
                  Our waiter will serve it{order.table_number != null ? ` at Table #${order.table_number}` : ""}.
                </p>
              </div>
            ) : (
              <div className="track-hero">
                <div className="eyebrow" style={{ color: "rgba(243,238,223,.65)", position: "relative", zIndex: 2 }}>Your food is being prepared</div>
                <CountRing active={isActive} />
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
            <div className="hint">This page checks for updates automatically every few seconds.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
