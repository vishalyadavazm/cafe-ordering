import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Coffee, MapPin, Minus, Plus, Search, ShoppingCart, X } from "lucide-react";
import { CATS, CAFE, MENU, findFood, rupee, type MenuItemMock } from "@/lib/mockData";
import { useCart, qtyOf, lineTotal } from "@/store/cart";
import { FoodTile } from "@/components/common/FoodTile";
import { VegMark } from "@/components/common/VegMark";
import { DetailSheet } from "@/features/customer/components/DetailSheet";

export function MenuPage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const { cart, addItem, decItem } = useCart();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState<number | null>(null);

  const subtotal = cart.reduce((s, c) => s + lineTotal(c), 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const count = cart.reduce((s, c) => s + c.qty, 0);

  const filtered = MENU.filter((m) => (cat === "All" || m.cat === cat) && (!q || m.name.toLowerCase().includes(q.toLowerCase())));
  const grouped = useMemo(() => {
    const g: Record<string, MenuItemMock[]> = {};
    filtered.forEach((m) => {
      (g[m.cat] = g[m.cat] || []).push(m);
    });
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, q]);

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="mhead">
          <div className="mhead-row">
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div className="brand-badge" style={{ width: 42, height: 42 }}><Coffee size={22} /></div>
              <div>
                <div className="cafe">{CAFE.name}</div>
                <div className="tbl"><MapPin size={12} /> Table #{CAFE.table}</div>
              </div>
            </div>
            <button className="icon-btn" onClick={() => navigate(`/t/${qrToken}/cart`)}>
              <ShoppingCart size={18} />{count > 0 && <span className="cart-dot">{count}</span>}
            </button>
          </div>
          <div className="searchbar">
            <Search size={16} color="var(--muted)" />
            <input placeholder="Search for dishes…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && <button onClick={() => setQ("")}><X size={15} color="var(--muted)" /></button>}
          </div>
        </div>
        <div className="tabs">
          {CATS.map((c) => (
            <button key={c} className={"tab " + (cat === c ? "on" : "")} onClick={() => { setCat(c); setQ(""); }}>{c}</button>
          ))}
        </div>
        <div className="screen-scroll">
          <div className="menu-list">
            {Object.keys(grouped).length === 0 && <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No dishes match "{q}".</div>}
            {Object.entries(grouped).map(([c, items]) => (
              <div key={c}>
                {cat === "All" && <div className="cat-label">{c}</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                  {items.map((f) => {
                    const n = qtyOf(cart, f.id);
                    return (
                      <div key={f.id} className={"food-card " + (f.avail ? "" : "unavail")}>
                        <div onClick={() => f.avail && setSheet(f.id)}><FoodTile food={f} /></div>
                        <div className="food-body">
                          <div className="food-name"><VegMark veg={f.veg} />{f.name}</div>
                          <div className="food-desc">{f.d}</div>
                          <div className="food-foot">
                            <span className="price">{rupee(f.price)}</span>
                            {!f.avail ? (
                              <span className="oos-tag">Out of stock</span>
                            ) : n > 0 ? (
                              <div className="qty">
                                <button onClick={() => decItem(f.id)}><Minus size={14} /></button>
                                <span className="n">{n}</span>
                                <button onClick={() => (f.addons ? setSheet(f.id) : addItem(f.id))}><Plus size={14} /></button>
                              </div>
                            ) : (
                              <button className="add-btn" onClick={() => (f.addons ? setSheet(f.id) : addItem(f.id))}><Plus size={14} /> Add</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {count > 0 && (
            <div className="viewcart" onClick={() => navigate(`/t/${qrToken}/cart`)}>
              <div><div className="l">{count} item{count > 1 ? "s" : ""} · Table #{CAFE.table}</div><div style={{ fontSize: 13, fontWeight: 600 }}>View cart</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="amt">{rupee(total)}</span><ArrowRight size={17} /></div>
            </div>
          )}
        </div>
        {sheet != null && (
          <DetailSheet
            food={findFood(sheet)!}
            onClose={() => setSheet(null)}
            onAdd={(addons) => { addItem(sheet, addons); setSheet(null); }}
          />
        )}
      </div>
    </div>
  );
}
