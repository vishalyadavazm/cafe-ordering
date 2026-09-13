import { useState } from "react";
import { Plus } from "lucide-react";
import { CATS, MENU, rupee } from "@/lib/mockData";
import { FoodTile } from "@/components/common/FoodTile";
import { VegMark } from "@/components/common/VegMark";

export function MenuManagementPage() {
  const [items, setItems] = useState(MENU.map((m) => ({ ...m })));
  const toggle = (id: number) => setItems((prev) => prev.map((m) => (m.id === id ? { ...m, avail: !m.avail } : m)));
  return (
    <>
      <div className="page-head">
        <div><div className="eyebrow">Kitchen</div><h2>Menu Management</h2><p>{items.length} items across {CATS.length - 1} categories.</p></div>
        <button className="btn btn-primary" style={{ padding: "11px 16px", fontSize: 14 }}><Plus size={16} /> Add item</button>
      </div>
      <div className="panel" style={{ padding: 6 }}>
        <table className="dtable">
          <thead><tr><th>Item</th><th>Category</th><th>Type</th><th>Price</th><th>Available</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 11 }}><FoodTile food={m} size={40} /><b style={{ fontSize: 13.5 }}>{m.name}</b></div></td>
                <td>{m.cat}</td>
                <td><VegMark veg={m.veg} /></td>
                <td className="mono" style={{ fontWeight: 700 }}>{rupee(m.price)}</td>
                <td>{m.avail ? <span className="chip c-green">Available</span> : <span className="chip c-red">Out of stock</span>}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button className={"toggle " + (m.avail ? "on" : "")} onClick={() => toggle(m.id)}><i /></button>
                    <button className="tiny-btn">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
