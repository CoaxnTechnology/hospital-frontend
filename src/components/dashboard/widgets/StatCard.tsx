import { useEffect, useState } from "react";

type Props = {
  title: string;
  value: number;
  gradient: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, gradient, icon }: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 50;
    const duration = 1200; // animation speed (ms)
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-5 text-white shadow-lg ${gradient}`}
    >
      {/* ICON */}
      <div className="absolute right-4 top-4 text-4xl opacity-30">{icon}</div>

      {/* CONTENT */}
      <div className="relative z-10">
        <h4 className="text-sm font-medium opacity-90">{title}</h4>
        <h2 className="text-3xl font-bold mt-2">{count}</h2>
      </div>

      {/* BOTTOM GLOW */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30"></div>
    </div>
  );
};

export default StatCard;
