import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { fadeUp, MOTION_DURATION } from '../lib/motion';

interface MetricCardProps {
  value: string;
  label: string;
  animate?: boolean;
  delay?: number;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  animate = true,
  delay = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(animate ? '0' : value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    const animateValue = (targetNum: string) => {
      const target = parseInt(targetNum);
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 fps
      const stepValue = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
      
        // Replace the number in the original value string
        const newValue = value.replace(/\d+/, Math.floor(current).toString());
        setDisplayValue(newValue);
      }, duration / steps);
    };

    if (animate && isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        // Check if the value contains a number to animate
        const numericValue = value.match(/\d+/);
        if (numericValue) {
          animateValue(numericValue[0]);
        } else {
          setDisplayValue(value);
        }
        setHasAnimated(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, animate, value, delay, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={fadeUp.initial}
      animate={isInView ? fadeUp.animate : fadeUp.initial}
      transition={{ duration: MOTION_DURATION.medium, delay }}
      className={`floating-element bg-white rounded-xl shadow-float p-6 text-center ${className}`}
    >
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {displayValue}
      </div>
      <div className="text-sm md:text-base text-gray-600 font-medium">
        {label}
      </div>
    </motion.div>
  );
};

export default MetricCard; 