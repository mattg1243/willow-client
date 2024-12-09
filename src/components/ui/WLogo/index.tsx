import { system } from "@/theme";

type WLogoProps = {
  height?: string | number;
};

export function WLogo({ height }: WLogoProps) {
  return (
    <div
      style={{
        background: system.token("colors.primary.500"),
        borderRadius: 100,
        height: height || 60,
        width: height || 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid white",
      }}>
      <p
        className="willow-cursive"
        style={{
          fontSize: "40px",
          color: "white",
        }}>
        W
      </p>
    </div>
  );
}
