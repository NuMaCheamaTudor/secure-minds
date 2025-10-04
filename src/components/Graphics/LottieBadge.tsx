import Lottie from "lottie-react";

export default function LottieBadge({
  data,
  label,
}: {
  data: object;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-card border rounded-xl hover:shadow-soft transition-all">
      <div className="w-16 h-16">
        <Lottie animationData={data} loop />
      </div>
      <p className="text-xs text-center text-muted-foreground">{label}</p>
    </div>
  );
}
