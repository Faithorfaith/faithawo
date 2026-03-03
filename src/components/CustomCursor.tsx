import { useEffect } from "react";
import { motion, useMotionValue } from "motion/react";

export function CustomCursor() {
  // Motion values for cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    document.body.style.cursor = "none"; // hide default cursor

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 4); // Center the 8px dot (half of 8px = 4px)
      mouseY.set(e.clientY - 4);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = ""; // reset cursor
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x: mouseX, y: mouseY }}
      className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full bg-[#e2a336]"
    />
  );
}