import { Coffee } from "lucide-react";

export function RealFoodTile({ name, imageUrl, size = 96, big = false }: { name: string; imageUrl: string | null; size?: number; big?: boolean }) {
  return (
    <div className="food-thumb" style={{ width: size, height: size, background: imageUrl ? undefined : "var(--accent-soft)" }}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Coffee size={big ? 40 : 28} color="var(--accent)" />
      )}
    </div>
  );
}
