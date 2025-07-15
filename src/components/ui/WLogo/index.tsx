import { system } from "@/theme";
import { useState } from "react";

type WLogoProps = {
  height?: string | number;
  onClick?: () => void;
};

export function WLogo({ height, onClick }: WLogoProps) {
  const [isHovered, setHovered] = useState<boolean>(false);

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
        cursor: isHovered && onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
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
