import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { CAFE } from "@/lib/mockData";

export function ConfirmedPage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const location = useLocation();
  const orderId = (location.state as { orderId?: number } | null)?.orderId;

  if (orderId == null) return <Navigate to={`/t/${qrToken}`} replace />;

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="confirm">
          <div className="confetti-ring"><CheckCircle2 size={52} /></div>
          <div className="eyebrow" style={{ marginTop: 20 }}>Order confirmed 🎉</div>
          <div className="order-no">#{orderId}</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 2 }}>Table #{CAFE.table} · sent to {CAFE.name}</div>
          <div className="eta-box">
            <div className="eyebrow">Estimated preparation</div>
            <div className="eta-big">20–25 min</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>The kitchen has received your order.</div>
          </div>
          <div style={{ width: "100%", marginTop: "auto", paddingTop: 24 }}>
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/order/${orderId}`)}>Track Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
