"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    function move(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      setHidden(false);
    }
    function leave() { setHidden(true); }
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      {/* Big soft glow follows cursor */}
      <div
        className="pointer-events-none fixed z-[1] transition-opacity duration-300"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: hidden ? 0 : 1,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(236,72,153,0.08) 35%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Tight precise dot follows cursor */}
      <div
        className="pointer-events-none fixed z-[2] transition-opacity duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: hidden ? 0 : 1,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            background:
              "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 60%)",
            filter: "blur(20px)",
          }}
        />
      </div>
    </>
  );
}
