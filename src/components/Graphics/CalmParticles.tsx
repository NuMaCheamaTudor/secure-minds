import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { useMemo, useCallback } from "react";

export default function CalmParticles() {
  const init = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      particles: {
        number: { value: 24 },
        size: { value: 1.6, random: true },
        move: { enable: true, speed: 0.3 },
        opacity: { value: 0.25 },
        color: { value: ["#6d5efc", "#11b5e4"] },
        links: { enable: true, opacity: 0.08, distance: 120, color: "#6d5efc" },
      },
      detectRetina: true,
    }),
    []
  );
  return <Particles id="calm" init={init} options={options} className="absolute inset-0 -z-10" />;
}
