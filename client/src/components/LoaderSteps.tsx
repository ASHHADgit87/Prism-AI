import {
  CircleIcon,
  ScanLineIcon,
  SquareIcon,
  TriangleIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const steps = [
  { icon: ScanLineIcon, label: "Reviewing your input..." },
  { icon: SquareIcon, label: "Building the page framework..." },
  { icon: TriangleIcon, label: "Putting interface elements together..." },
  { icon: CircleIcon, label: "Wrapping up the final output..." },
];

const STEP_DURATION = 45000;

const LoaderSteps = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((s) => (s + 1) % steps.length);
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, []);

  const Icon = steps[current].icon;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#004d1a", color: "white" }}
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, #005c2a33, #004d1a66)" }}
      />

      <div className="relative z-10 w-32 h-32 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border animate-ping opacity-30"
          style={{ borderColor: "#00FFAB" }}
        />
        <div
          className="absolute inset-4 rounded-full border"
          style={{ borderColor: "#00FFAB33" }}
        />
        <Icon
          className="w-8 h-8 opacity-80 animate-bounce"
          style={{ color: "#00FFAB" }}
        />
      </div>

      {/* Step label */}
      <p
        className="mt-8 text-lg font-light tracking-wide transition-all duration-700 ease-in-out opacity-100"
        key={current}
        style={{ color: "#a3f7c1" }}
      >
        {steps[current].label}
      </p>
      <p
        className="text-xs mt-2 transition-opacity duration-700 opacity-100"
        style={{ color: "#b2f7c1" }}
      >
        This process usually takes about 2-3 minutes.
      </p>
    </div>
  );
};

export default LoaderSteps;
