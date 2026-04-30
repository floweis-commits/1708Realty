"use client";
import { useEffect, useRef } from "react";

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const pointer = { x: 0, y: 0 };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    });

    const spacing = 24;
    let raf = 0;
    const start = performance.now();

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const elapsed = (t - start) / 20000;
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * Math.PI * 2);
      for (let y = 0; y < h; y += spacing) {
        for (let x = 0; x < w; x += spacing) {
          const dx = pointer.x * 20;
          const dy = pointer.y * 20;
          const fade = 1 - y / h;
          const a = 0.08 + 0.18 * pulse * fade;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fillRect(x + dx, y + dy, 1.4, 1.4);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}
