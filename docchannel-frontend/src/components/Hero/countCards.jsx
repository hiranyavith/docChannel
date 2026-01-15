import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

function CountCards({ count, label }) {
  const countValue = useMotionValue(0);
  const rounded = useTransform(countValue, (latest) => Math.round(latest));
  useEffect(() => {
    const controls = animate(countValue, count, {
      duration: 2.5,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, countValue]);
  return (
    <div className="flex flex-col items-center text-center pointer-events-auto bg-white/90 md:bg-transparent rounded-xl p-4 md:p-0 shadow-sm md:shadow-none min-w-[120px]">
      <motion.h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-nunito text-gray-900">
        <motion.span>{rounded}</motion.span>+
      </motion.h1>
      <p className="text-gray-700 font-nunito text-xs md:text-sm mt-1">
        {label}
      </p>
    </div>
  );
}

export default CountCards;
