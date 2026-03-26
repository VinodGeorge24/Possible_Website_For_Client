import React from 'react';
import { motion } from 'framer-motion';


const PageBanner = ({ eyebrow, title, description }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="overflow-hidden rounded-[32px] border border-[#e8d7c6] bg-[linear-gradient(135deg,rgba(255,248,240,0.98),rgba(244,229,213,0.88))] px-6 py-10 shadow-[0_24px_80px_rgba(77,52,36,0.12)] md:px-10"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9a5a36]">
        {eyebrow}
      </p>
      <h1 className="max-w-4xl font-display text-4xl leading-tight text-[#2f241d] md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-[#5f5348] md:text-lg">
        {description}
      </p>
    </motion.section>
  );
};


export default PageBanner;
