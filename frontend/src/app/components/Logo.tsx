'use client';

import { motion } from 'framer-motion';

export const Logo = () => {
  return (
    <motion.div 
      className="flex items-center space-x-1 cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <span className="text-2xl font-bold bg-gradient-to-r from-[rgb(333,115,70)] to-[rgb(208,68,35)] bg-clip-text text-transparent">
        excel
      </span>
      <motion.div
        className="w-6 h-6 text-2xl font-bold text-purple-600"
        animate={{ 
          rotate: [0, 180],
          scale: [1, 1.2, 1] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        2
      </motion.div>
      <span className="text-2xl font-bold text-gray-900">
        ppt
      </span>
    </motion.div>
  );
}; 