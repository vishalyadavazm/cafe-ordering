import { useState } from "react";
import { Check, X } from "lucide-react";
import { ADDONS, TINT, rupee, type AddOnMock, type MenuItemMock } from "@/lib/mockData";
import { VegMark } from "@/components/common/VegMark";

export function DetailSheet({ food, onClose, onAdd }: { food: MenuItemMock; onClose: () => void; onAdd: (addons: AddOnMock[]) => void }) {
  const [sel, setSel] = useState<AddOnMock[]>([]);
  const toggle = (a: AddOnMock) => setSel((prev) => (prev.find((x) => x.name === a.name) ? prev.filter((x) => x.name !== a.name) : [...prev, a]));
  const extra = sel.reduce((s, a) => s + a.price, 0);

  return (
    <div className="sheet-wrap">
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-hero" style={{ background: `radial-gradient(120% 120% at 30% 15%, #fff9, transparent), ${TINT[food.cat]}` }}>
          <span className="emoji">{food.e}</span>
          <button className="sheet-close" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="sheet-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div className="food-name" style={{ fontSize: 20 }}><VegMark veg={food.veg} />{food.name}</div>
              <span className="chip c-green" style={{ marginTop: 8 }}><Check size={12} /> Available</span>
            </div>
            <span className="price" style={{ fontSize: 20 }}>{rupee(food.price)}</span>
          </div>
          <p style={{ color: "var(--ink2)", fontSize: 14, lineHeight: 1.55, marginTop: 12 }}>{food.d}.</p>
          {food.addons && (
            <>
              <div className="eyebrow" style={{ marginTop: 18 }}>Add-ons</div>
              {ADDONS.map((a) => {
                const on = !!sel.find((x) => x.name === a.name);
                return (
                  <div key={a.name} className={"addon " + (on ? "on" : "")} onClick={() => toggle(a)}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="mono" style={{ fontWeight: 700, color: "var(--accent)" }}>+{rupee(a.price)}</span>
                      <span className="checkbox">{on && <Check size={14} />}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={() => onAdd(sel)}>
            Add to Cart · {rupee(food.price + extra)}
          </button>
        </div>
      </div>
    </div>
  );
}
