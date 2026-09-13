import { useState } from "react";
import { Check, X } from "lucide-react";
import { rupee } from "@/lib/mockData";
import { VegMark } from "@/components/common/VegMark";
import { RealFoodTile } from "@/features/customer/components/RealFoodTile";
import type { PublicAddOn, PublicMenuItem } from "@/features/customer/api";

export function RealDetailSheet({ food, onClose, onAdd }: { food: PublicMenuItem; onClose: () => void; onAdd: (addons: PublicAddOn[]) => void }) {
  const [sel, setSel] = useState<PublicAddOn[]>([]);
  const toggle = (a: PublicAddOn) => setSel((prev) => (prev.find((x) => x.id === a.id) ? prev.filter((x) => x.id !== a.id) : [...prev, a]));
  const price = Number(food.price);
  const extra = sel.reduce((s, a) => s + Number(a.price), 0);

  return (
    <div className="sheet-wrap">
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-hero" style={{ background: "var(--accent-soft)" }}>
          <RealFoodTile name={food.name} imageUrl={food.image_url} size={110} big />
          <button className="sheet-close" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="sheet-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div className="food-name" style={{ fontSize: 20 }}><VegMark veg={food.is_veg} />{food.name}</div>
              <span className="chip c-green" style={{ marginTop: 8 }}><Check size={12} /> Available</span>
            </div>
            <span className="price" style={{ fontSize: 20 }}>{rupee(price)}</span>
          </div>
          {food.description && <p style={{ color: "var(--ink2)", fontSize: 14, lineHeight: 1.55, marginTop: 12 }}>{food.description}</p>}
          {food.addons.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginTop: 18 }}>Add-ons</div>
              {food.addons.map((a) => {
                const on = !!sel.find((x) => x.id === a.id);
                return (
                  <div key={a.id} className={"addon " + (on ? "on" : "")} onClick={() => toggle(a)}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="mono" style={{ fontWeight: 700, color: "var(--accent)" }}>+{rupee(Number(a.price))}</span>
                      <span className="checkbox">{on && <Check size={14} />}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={() => onAdd(sel)}>
            Add to Cart · {rupee(price + extra)}
          </button>
        </div>
      </div>
    </div>
  );
}
