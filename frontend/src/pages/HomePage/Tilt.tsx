import React, { useState, useRef } from "react";
import type { MouseEvent } from "react";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
}

const Tilt: React.FC<TiltProps> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to the card's top-left corner
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates to range between -0.5 and 0.5
    const xVal = (mouseX / width) - 0.5;
    const yVal = (mouseY / height) - 0.5;

    // Tilt values (adjust multiplier to increase/decrease tilt severity)
    const tiltX = yVal * -15; // rotate around X axis (looks up/down)
    const tiltY = xVal * 15;  // rotate around Y axis (looks left/right)

    setIsHovered(true);

    // Apply styles directly to custom properties or elements
    card.style.setProperty("--tilt-x", `${tiltX}deg`);
    card.style.setProperty("--tilt-y", `${tiltY}deg`);
    card.style.setProperty("--glare-x", `${(mouseX / width) * 100}%`);
    card.style.setProperty("--glare-y", `${(mouseY / height) * 100}%`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl transition-all duration-200 ease-out preserve-3d cursor-pointer ${className}`}
      style={{
        transform: isHovered
          ? "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale3d(1.03, 1.03, 1.03)"
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Child content */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>

      {/* Glare/Shine Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.12) 0%, transparent 60%)`,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default Tilt;

