import Lottie from "lottie-react";

export default function LottieHeroStep({
  data,
  className = "",
  loop = false,
}: {
  data: object;
  className?: string;
  loop?: boolean;
}) {
  // Important: folosim key pe container în pagina părinte ca să „remount” la schimbarea animației
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/40 pointer-events-none rounded-2xl" />
      <Lottie animationData={data} loop={loop} autoplay className="w-full h-full" />
    </div>
  );
}
