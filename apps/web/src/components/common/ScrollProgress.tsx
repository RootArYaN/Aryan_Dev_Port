import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-cyan-300 via-white to-violet-400"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
