import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Coffee, MapPin, QrCode } from "lucide-react";
import { getPublicMenu } from "@/features/customer/api";

export function WelcomePage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-menu", qrToken],
    queryFn: () => getPublicMenu(qrToken!),
    enabled: !!qrToken,
  });

  if (isError) {
    return (
      <div className="customer-app"><div className="screen">
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          This table link looks invalid. Please scan the QR code on your table again.
        </div>
      </div></div>
    );
  }

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="welcome">
          <div className="wm-top">
            <span className="pill"><QrCode size={13} /> QR verified</span>
            <span className="pill"><MapPin size={13} /> Dine-in</span>
          </div>
          <div className="welcome-logo"><Coffee size={30} /></div>
          <div className="eyebrow" style={{ color: "rgba(243,238,223,.6)", marginTop: 20 }}>Welcome to</div>
          <h1>{isLoading ? "…" : data?.cafe.name}</h1>
          <p className="lede">You've been seated. Browse the menu, order right from your phone — no app, no queue.</p>
          {data?.table && <div className="table-chip"><span>You're at</span><span className="num">Table #{data.table.number}</span></div>}
          <div className="wm-spacer" />
          <button className="btn btn-light btn-block" onClick={() => navigate(`/t/${qrToken}/menu`)}>
            View Menu <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
