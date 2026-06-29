import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
}

const InteractiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Particle[] = [];
    const particleCount = 75; // slightly reduced for elegance and performance
    const focalLength = 300;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      radius: 150,
    };

    // Soft, premium glowing colors (mostly green/emerald with a hint of gold)
    const colors = [
      "rgba(74, 222, 128, 0.4)",  // green-400
      "rgba(52, 211, 153, 0.35)", // emerald-400
      "rgba(250, 204, 21, 0.25)",  // yellow-400
    ];

    // Initialize particles in a 3D volume
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * width * 1.6;
      const y = (Math.random() - 0.5) * height * 1.6;
      const z = Math.random() * 800 - 400;

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2.5 + 1.2, // slightly larger, softer particles
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left - width / 2;
      mouse.targetY = e.clientY - rect.top - height / 2;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates smoothly
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Update and draw particles
      particles.forEach((p) => {
        // Slow Y-axis rotation
        const angleSpeed = 0.0003;
        const cosY = Math.cos(angleSpeed);
        const sinY = Math.sin(angleSpeed);

        const rx = p.x * cosY - p.z * sinY;
        const rz = p.z * cosY + p.x * sinY;

        p.x = rx;
        p.z = rz;

        // Project 3D coordinates onto 2D space
        const scale = focalLength / (focalLength + p.z + 400);
        const projX = p.x * scale + width / 2 + mouse.x * 0.12;
        const projY = p.y * scale + height / 2 + mouse.y * 0.12;

        // Mouse hover interaction
        const dx = projX - (mouse.x + width / 2);
        const dy = projY - (mouse.y + height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        let offsetX = 0;
        let offsetY = 0;
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          offsetX = (dx / distance) * force * 18;
          offsetY = (dy / distance) * force * 18;
        }

        const finalX = projX + offsetX;
        const finalY = projY + offsetY;
        const size = p.size * scale * 1.8;

        if (finalX > 0 && finalX < width && finalY > 0 && finalY < height) {
          ctx.beginPath();
          ctx.arc(finalX, finalY, size > 0.1 ? size : 0.1, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10 * scale;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      });

      ctx.shadowBlur = 0; // reset shadow glow
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none block"
      style={{ zIndex: 1 }}
    />
  );
};

export default InteractiveCanvas;
