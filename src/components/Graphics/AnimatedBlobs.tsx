export default function AnimatedBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute -bottom-16 -right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px) translateX(0px) }
          50% { transform: translateY(-12px) translateX(6px) }
        }
      `}</style>
    </div>
  );
}
