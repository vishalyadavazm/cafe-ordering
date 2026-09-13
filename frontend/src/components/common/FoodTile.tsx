import { TINT } from "@/lib/mockData";

export function FoodTile({ food, size = 96, big = false }: { food: { cat: string; e: string }; size?: number; big?: boolean }) {
  return (
    <div
      className="food-thumb"
      style={{ width: size, height: size, background: `radial-gradient(120% 120% at 30% 20%, #fff9, transparent), ${TINT[food.cat] || "#f0e7d6"}` }}
    >
      <span className="emoji" style={big ? { fontSize: 88 } : undefined}>{food.e}</span>
    </div>
  );
}
