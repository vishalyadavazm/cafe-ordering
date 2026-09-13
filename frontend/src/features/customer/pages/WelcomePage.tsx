import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Coffee, MapPin, QrCode } from "lucide-react";
import { CAFE } from "@/lib/mockData";

export function WelcomePage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();

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
          <h1>{CAFE.name}</h1>
          <p className="lede">You've been seated. Browse the menu, order right from your phone — no app, no queue.</p>
          <div className="table-chip"><span>You're at</span><span className="num">Table #{CAFE.table}</span></div>
          <div className="wm-spacer" />
          <button className="btn btn-light btn-block" onClick={() => navigate(`/t/${qrToken}/menu`)}>
            View Menu <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
