import Lottie from "lottie-react";

export default function LottieBadge({
  data,
  label,
  className = "",
}: {
  data: object;
  label: string;
  className?: string;
}) {
  return (
    <div className={`calm-card p-4 text-center ${className}`}>
      <div className="mx-auto w-20 h-20">
        <Lottie animationData={data} loop autoplay />
      </div>
      <div className="text-sm font-medium mt-2">{label}</div>
    </div>
  );
}
