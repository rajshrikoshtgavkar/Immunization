import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      shadow: 'shadow-blue-500/30',
      glow: 'group-hover:shadow-blue-500/50'
    },
    green: {
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      shadow: 'shadow-green-500/30',
      glow: 'group-hover:shadow-green-500/50'
    },
    red: {
      gradient: 'from-red-500 via-pink-500 to-rose-500',
      shadow: 'shadow-red-500/30',
      glow: 'group-hover:shadow-red-500/50'
    }
  };

  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: 'spring' }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group relative bg-white rounded-3xl p-8 cursor-pointer transition-all duration-500 shadow-xl ${config.shadow} hover:shadow-2xl ${config.glow} overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
            <motion.p
              className={`text-6xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
              key={count}
            >
              {count}
            </motion.p>
          </div>
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ${config.shadow}`}
          >
            {icon}
          </motion.div>
        </div>
        <div className={`h-2 bg-gradient-to-r ${config.gradient} rounded-full`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: delay + 0.5, duration: 1 }}
            className="h-full bg-white/30 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
