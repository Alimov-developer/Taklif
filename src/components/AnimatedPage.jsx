import React from 'react';
import { motion } from 'framer-motion';

const AnimatedPage = ({ children, className, style }) => (
  <motion.div 
    className={className}
    style={style}
    initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }} 
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
    exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
