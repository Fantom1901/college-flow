import React, { useState, useEffect, useRef } from "react";
import FOG from 'vanta/dist/vanta.fog.min.js'
import * as THREE from 'three';

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x60a5fa,
          midtoneColor: 0xc084fc,
          lowlightColor: 0x34d399,
          baseColor: 0xf8fafc,
          blurFactor: 1.35,
          speed: 1.5,
          zoom: 1.8
        })
      )
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    }
  }, [vantaEffect]);

  return (
    <div
    ref={vantaRef}
    className="fixed inset-0 z-[-1] w-full h-full"
    >
      <div className="absolute inset-0 bg-[('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
    </div>
  )
}

export default VantaBackground;