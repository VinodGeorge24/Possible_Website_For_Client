import React from 'react';


const SectionTitle = ({ eyebrow, title, description, align = 'left' }) => {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9a5a36]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl leading-tight text-[#2f241d] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[#5f5348] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
};


export default SectionTitle;
