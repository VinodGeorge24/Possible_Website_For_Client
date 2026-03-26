import React from 'react';

import PageBanner from '../components/common/PageBanner';
import { siteContent } from '../content/siteContent';


const FAQ = () => {
  return (
    <div className="space-y-10">
      <PageBanner
        eyebrow="FAQ"
        title="Set expectations early and keep the stay request conversation cleaner."
        description="These answers explain how the inquiry-first launch works and where kosher-minded guests should expect a direct follow-up."
      />

      <section className="grid gap-5">
        {siteContent.faqs.map((faq) => (
          <article key={faq.question} className="rounded-[30px] border border-[#ead8c8] bg-white/90 p-7 shadow-[0_14px_45px_rgba(77,52,36,0.08)]">
            <h2 className="font-display text-3xl text-[#2f241d]">{faq.question}</h2>
            <p className="mt-4 text-base leading-8 text-[#5f5348]">{faq.answer}</p>
          </article>
        ))}
      </section>
    </div>
  );
};


export default FAQ;
