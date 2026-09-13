import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Coffee, MapPin, Minus, Plus, Search, ShoppingCart, X } from "lucide-react";
import { getPublicMenu, type PublicMenuItem } from "@/features/customer/api";
import { rupee } from "@/lib/mockData";
import { useCart, qtyOfItem, lineTotal } from "@/store/cart";
import { RealFoodTile } from "@/features/customer/components/RealFoodTile";
import { RealDetailSheet } from "@/features/customer/components/RealDetailSheet";
import { VegMark } from "@/components/common/VegMark";

export function MenuPage() {
  const navigate = useNavigate();
  const { qrToken } = useParams<{ qrToken: string }>();
  const { cart, addItem, decItem } = useCart();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sheetId, setSheetId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-menu", qrToken],
    queryFn: () => getPublicMenu(qrToken!),
    enabled: !!qrToken,
  });

  const categories = data?.categories ?? [];
  const tabs = useMemo(() => ["All", ...categories.map((c) => c.name)], [categories]);
  const visible = categories
    .filter((c) => cat === "All" || c.name === cat)
    .map((c) => ({ ...c, items: c.items.filter((i) => !q || i.name.toLowerCase().includes(q.toLowerCase())) }))
    .filter((c) => c.items.length > 0);

  const allItems = categories.flatMap((c) => c.items);
  const sheetItem: PublicMenuItem | undefined = allItems.find((i) => i.id === sheetId);

  const subtotal = cart.reduce((s, c) => s + lineTotal(c), 0);
  const tax = Math.round(subtotal * (Number(data?.cafe.gst_rate) || 0) / 100);
  const total = subtotal + tax;
  const count = cart.reduce((s, c) => s + c.qty, 0);

  function handleAddSimple(item: PublicMenuItem) {
    addItem({ id: item.id, name: item.name, price: Number(item.price), veg: item.is_veg, imageUrl: item.image_url }, []);
  }
  function handleAddWithAddons(item: PublicMenuItem, addons: { id: string; name: string; price: string }[]) {
    addItem(
      { id: item.id, name: item.name, price: Number(item.price), veg: item.is_veg, imageUrl: item.image_url },
      addons.map((a) => ({ id: a.id, name: a.name, price: Number(a.price) })),
    );
    setSheetId(null);
  }

  return (
    <div className="customer-app">
      <div className="screen">
        <div className="mhead">
          <div className="mhead-row">
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div className="brand-badge" style={{ width: 42, height: 42 }}><Coffee size={22} /></div>
              <div>
                <div className="cafe">{data?.cafe.name ?? "…"}</div>
                {data?.table && <div className="tbl"><MapPin size={12} /> Table #{data.table.number}</div>}
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
          {tabs.map((c) => (
            <button key={c} className={"tab " + (cat === c ? "on" : "")} onClick={() => { setCat(c); setQ(""); }}>{c}</button>
          ))}
        </div>
        <div className="screen-scroll">
          <div className="menu-list">
            {isLoading && <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading menu…</div>}
            {!isLoading && visible.length === 0 && <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No dishes match "{q}".</div>}
            {visible.map((c) => (
              <div key={c.id}>
                {cat === "All" && <div className="cat-label">{c.name}</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                  {c.items.map((f) => {
                    const n = qtyOfItem(cart, f.id);
                    const hasAddons = f.addons.length > 0;
                    return (
                      <div key={f.id} className="food-card">
                        <div onClick={() => setSheetId(f.id)}><RealFoodTile name={f.name} imageUrl={f.image_url} /></div>
                        <div className="food-body">
                          <div className="food-name"><VegMark veg={f.is_veg} />{f.name}</div>
                          {f.description && <div className="food-desc">{f.description}</div>}
                          <div className="food-foot">
                            <span className="price">{rupee(Number(f.price))}</span>
                            {n > 0 ? (
                              <div className="qty">
                                <button onClick={() => { const idx = cart.map((c2) => c2.itemId).lastIndexOf(f.id); if (idx >= 0) decItem(cart[idx].key); }}><Minus size={14} /></button>
                                <span className="n">{n}</span>
                                <button onClick={() => (hasAddons ? setSheetId(f.id) : handleAddSimple(f))}><Plus size={14} /></button>
                              </div>
                            ) : (
                              <button className="add-btn" onClick={() => (hasAddons ? setSheetId(f.id) : handleAddSimple(f))}><Plus size={14} /> Add</button>
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
              <div><div className="l">{count} item{count > 1 ? "s" : ""}{data?.table ? ` · Table #${data.table.number}` : ""}</div><div style={{ fontSize: 13, fontWeight: 600 }}>View cart</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="amt">{rupee(total)}</span><ArrowRight size={17} /></div>
            </div>
          )}
        </div>
        {sheetItem && (
          <RealDetailSheet
            food={sheetItem}
            onClose={() => setSheetId(null)}
            onAdd={(addons) => handleAddWithAddons(sheetItem, addons)}
          />
        )}
      </div>
    </div>
  );
}
