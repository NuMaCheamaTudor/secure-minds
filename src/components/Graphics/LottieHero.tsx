import { useMemo } from "react";
import Lottie from "lottie-react";

// import EXACT după numele fișierelor tale din src/assets/loottie
import doctorAndHealth from "@/assets/loottie/Doctor and health symbols.json";
import healthInsurance from "@/assets/loottie/health insurance.json";
import doctor from "@/assets/loottie/Doctor.json";
import mentalTherapy from "@/assets/loottie/Mental Therapy.json";
import medicineOnline from "@/assets/loottie/medicine online.json";

const pool = [doctorAndHealth, healthInsurance, doctor, mentalTherapy, medicineOnline];

export default function LottieHero({ className = "", fixedIndex }: { className?: string; fixedIndex?: number }) {
  // dacă dai fixedIndex, afișează mereu aceeași animație; altfel alege aleator la mount
  const animationData = useMemo(() => {
    if (typeof fixedIndex === "number" && pool[fixedIndex]) return pool[fixedIndex];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [fixedIndex]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/40 pointer-events-none rounded-2xl" />
      <Lottie animationData={animationData} loop autoplay className="w-full h-full" />
    </div>
  );
}
