import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import doctorAndHealth from "@/assets/loottie/Doctor and health symbols.json";

export default function InitialSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // verifică dacă există user în localStorage
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.role === "doctor") {
          navigate("/doctor/dashboard", { replace: true });
        } else if (user?.role === "patient") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        navigate("/", { replace: true });
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-64 h-64"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Lottie animationData={doctorAndHealth} loop />
      </motion.div>
      <motion.h1
        className="text-2xl font-bold text-primary mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        MindCare
      </motion.h1>
      <motion.p
        className="text-muted-foreground mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Asistență medicală accesibilă pentru toți
      </motion.p>
    </motion.div>
  );
}
