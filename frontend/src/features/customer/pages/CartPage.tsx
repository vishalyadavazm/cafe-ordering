import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { getPublicMenu } from "@/features/customer/api";
import { rupee } from "@/lib/mockData";
import { useCart, lineTotal } from "@/store/cart";
import { RealFoodTile } from "@/features/customer/components/RealFoodTile";

export function CartPage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const { cart, addItem, decItem, removeLine } = useCart();
  const { data } = useQuery({
    queryKey: ["public-menu", qrToken],
    queryFn: () => getPublicMenu(qrToken!),
    enabled: !!qrToken,
  });

  const subtotal = cart.reduce((s, c) => s + lineTotal(c), 0);
  const tax = Math.round(subtotal * (Number(data?.cafe.gst_rate) || 0) / 100);
  const total = subtotal + tax;

  return (
    <div className="customer-app">
      <div className="screen sub">
        <div className="subhead">
          <button className="icon-btn" onClick={() => navigate(`/t/${qrToken}/menu`)}><ChevronLeft size={18} /></button>
          <div><h2>Your Order</h2>{data && <div style={{ fontSize: 12, color: "var(--muted)" }}>Table #{data.table.number} · {data.cafe.name}</div>}</div>
        </div>
        <div className="screen-scroll">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 30px", color: "var(--muted)" }}>
              <ShoppingCart size={40} style={{ opacity: 0.4 }} />
              <p style={{ marginTop: 12, fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: 13 }}>Add something delicious from the menu.</p>
              <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate(`/t/${qrToken}/menu`)}>Browse menu</button>
            </div>
          ) : (
            <>
              <div className="receipt">
                {cart.map((c) => (
                  <div className="rline" key={c.key}>
                    <RealFoodTile name={c.name} imageUrl={c.imageUrl} size={54} />
                    <div className="rn">
                      <b>{c.name}</b>
                      {c.addons.length > 0 && <small>+ {c.addons.map((a) => a.name).join(", ")}</small>}
                      <button className="remove" onClick={() => removeLine(c.key)}>Remove</button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="qty" style={{ marginBottom: 6 }}>
                        <button onClick={() => decItem(c.key)}><Minus size={14} /></button>
                        <span className="n">{c.qty}</span>
                        <button onClick={() => addItem({ id: c.itemId, name: c.name, price: c.price, veg: c.veg, imageUrl: c.imageUrl }, c.addons)}><Plus size={14} /></button>
                      </div>
                      <div className="price">{rupee(lineTotal(c))}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="totals">
                <div className="trow"><span>Subtotal</span><span className="mono">{rupee(subtotal)}</span></div>
                <div className="trow"><span>GST{data ? ` (${data.cafe.gst_rate}%)` : ""}</span><span className="mono">{rupee(tax)}</span></div>
                <div className="trow grand"><span>Total</span><span className="mono">{rupee(total)}</span></div>
              </div>
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="foot-cta">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/t/${qrToken}/pay`)}>
              Proceed to Payment · {rupee(total)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
