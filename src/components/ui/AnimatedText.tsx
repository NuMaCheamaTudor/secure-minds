import { motion } from "framer-motion";

type SplitProps = { text: string; className?: string; delay?: number; charDelay?: number };

// SplitTextTitle: animăm DOAR titlurile/descrierile, nu conținutul chestionarului
export function SplitTextTitle({ text, className = "", delay = 0.05, charDelay = 0.02 }: SplitProps) {
  const chars = Array.from(text);
  return (
    <h1 className={className} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: delay + i * charDelay }}
          className="inline-block will-change-transform"
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </h1>
  );
}

type ShinyProps = { children: React.ReactNode; className?: string };
// ShinySubtitle: efect “shiny text” (gradient), subtil
export function ShinySubtitle({ children, className = "" }: ShinyProps) {
  return <p className={`shiny-text ${className}`}>{children}</p>;
}
