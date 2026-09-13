import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Banknote, ChevronLeft, CreditCard, Smartphone, Wallet } from "lucide-react";
import { createPublicOrder, getPublicMenu } from "@/features/customer/api";
import { rupee } from "@/lib/mockData";
import { useCart, lineTotal } from "@/store/cart";
import { FakeQR } from "@/components/common/FakeQR";

type PayMethod = "upi" | "card" | "cash";

const OPTIONS: { k: PayMethod; ic: React.ReactNode; t: string; s: string }[] = [
  { k: "upi", ic: <Smartphone size={20} />, t: "UPI", s: "GPay, PhonePe, Paytm & more" },
  { k: "card", ic: <CreditCard size={20} />, t: "Credit / Debit Card", s: "Visa, Mastercard, RuPay" },
  { k: "cash", ic: <Banknote size={20} />, t: "Cash at Counter", s: "Pay when your food arrives" },
];

export function PaymentPage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const { cart, clear } = useCart();
  const [pay, setPay] = useState<PayMethod>("upi");

  const { data } = useQuery({
    queryKey: ["public-menu", qrToken],
    queryFn: () => getPublicMenu(qrToken!),
    enabled: !!qrToken,
  });

  const subtotal = cart.reduce((s, c) => s + lineTotal(c), 0);
  const tax = Math.round(subtotal * (Number(data?.cafe.gst_rate) || 0) / 100);
  const total = subtotal + tax;

  const mutation = useMutation({
    mutationFn: () =>
      createPublicOrder(
        qrToken!,
        cart.map((c) => ({ menu_item_id: c.itemId, quantity: c.qty, addon_ids: c.addons.map((a) => a.id) })),
      ),
    onSuccess: (order) => {
      clear();
      navigate(`/t/${qrToken}/confirmed`, { state: { orderNumber: order.order_number, session: order.customer_session } });
    },
  });

  return (
    <div className="customer-app">
      <div className="screen sub">
        <div className="subhead">
          <button className="icon-btn" onClick={() => navigate(`/t/${qrToken}/cart`)}><ChevronLeft size={18} /></button>
          <div><h2>Payment</h2><div style={{ fontSize: 12, color: "var(--muted)" }}>Order total {rupee(total)}</div></div>
        </div>
        <div className="screen-scroll" style={{ padding: "18px 18px 10px" }}>
          <div className="eta-box" style={{ marginTop: 0, textAlign: "center" }}>
            <div className="eyebrow">Amount payable</div>
            <div className="eta-big" style={{ color: "var(--ink)" }}>{rupee(total)}</div>
          </div>
          <div className="eyebrow" style={{ margin: "20px 2px 4px" }}>Choose a method</div>
          {OPTIONS.map((o) => (
            <div key={o.k} className={"pay-opt " + (pay === o.k ? "on" : "")} onClick={() => setPay(o.k)}>
              <div className="pay-ic">{o.ic}</div>
              <div><div style={{ fontWeight: 600, fontSize: 14.5 }}>{o.t}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{o.s}</div></div>
              <div className="radio" />
            </div>
          ))}
          {pay === "upi" && (
            <div className="panel" style={{ marginTop: 14, textAlign: "center", padding: 16 }}>
              <FakeQR seed={total} size={128} />
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Scan to pay with any UPI app</div>
            </div>
          )}
          {mutation.isError && (
            <p role="alert" className="form-error" style={{ marginTop: 14 }}>Couldn't place your order. Please try again.</p>
          )}
        </div>
        <div className="foot-cta">
          <button className="btn btn-primary btn-block" disabled={cart.length === 0 || mutation.isPending} onClick={() => mutation.mutate()}>
            <Wallet size={17} /> {mutation.isPending ? "Placing order…" : pay === "cash" ? `Place Order · ${rupee(total)}` : `Pay ${rupee(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
