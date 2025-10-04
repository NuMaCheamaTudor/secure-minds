import { motion } from "framer-motion";

export default function HamburgerButton({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button
      aria-label="Deschide meniul"
      onClick={onClick}
      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition"
    >
      <motion.span initial={false} animate={open ? "open" : "closed"} className="relative block w-5 h-4">
        <motion.span
          variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }}
          className="absolute left-0 top-0 h-[2px] w-5 bg-foreground"
        />
        <motion.span
          variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
          className="absolute left-0 top-[7px] h-[2px] w-5 bg-foreground"
        />
        <motion.span
          variants={{ closed: { rotate: 0, y: 14 }, open: { rotate: -45, y: 6 } }}
          className="absolute left-0 top-[14px] h-[2px] w-5 bg-foreground"
        />
      </motion.span>
    </button>
  );
}
