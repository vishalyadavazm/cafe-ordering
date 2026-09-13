import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { getPublicMenu } from "@/features/customer/api";

interface ConfirmedState {
  orderNumber: number;
  session: string;
}

export function ConfirmedPage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const location = useLocation();
  const state = location.state as ConfirmedState | null;

  const { data } = useQuery({
    queryKey: ["public-menu", qrToken],
    queryFn: () => getPublicMenu(qrToken!),
    enabled: !!qrToken,
  });

  if (!state) return <Navigate to={`/t/${qrToken}`} replace />;

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="confirm">
          <div className="confetti-ring"><CheckCircle2 size={52} /></div>
          <div className="eyebrow" style={{ marginTop: 20 }}>Order confirmed 🎉</div>
          <div className="order-no">#{state.orderNumber}</div>
          {data && <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 2 }}>Table #{data.table.number} · sent to {data.cafe.name}</div>}
          <div className="eta-box">
            <div className="eyebrow">Estimated preparation</div>
            <div className="eta-big">20–25 min</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>The kitchen has received your order.</div>
          </div>
          <div style={{ width: "100%", marginTop: "auto", paddingTop: 24 }}>
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/order/${state.session}`)}>Track Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
