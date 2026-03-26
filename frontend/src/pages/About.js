import React from 'react';

import PageBanner from '../components/common/PageBanner';
import SectionTitle from '../components/common/SectionTitle';
import { siteContent } from '../content/siteContent';


const About = () => {
  return (
    <div className="space-y-10">
      <PageBanner
        eyebrow="About the stay"
        title="A single-property Scottsdale rental positioned for kosher-minded family travel."
        description="The public experience is intentionally focused: one property, one story, and one clear path for guests to ask questions or request dates."
      />

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[34px] border border-[#ead8c8] bg-white/90 p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Positioning"
            title="Premium without feeling formal"
            description={siteContent.overview.intro}
          />
          <p className="mt-6 text-base leading-8 text-[#5f5348]">{siteContent.overview.body}</p>
        </div>

        <div className="overflow-hidden rounded-[34px] shadow-[0_24px_70px_rgba(77,52,36,0.16)]">
          <img
            src={siteContent.gallery[1].src}
            alt={siteContent.gallery[1].alt}
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[34px] border border-[#ead8c8] bg-[linear-gradient(145deg,rgba(255,251,246,0.96),rgba(247,236,225,0.9))] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Sleeping arrangement"
            title="Flexible enough for real family travel"
            description="The room mix is meant to support parents, children, cousins, and small groups without making the home feel crowded."
          />
          <div className="mt-6 space-y-4">
            {siteContent.sleepingArrangements.map((item) => (
              <div key={item} className="rounded-[24px] bg-white/75 px-5 py-4 text-sm leading-7 text-[#4e4036]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-[#ead8c8] bg-[#fff9f3] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="House expectations"
            title="Clear standards keep the stay relaxed"
            description="The brand tone is welcoming, but the home still needs straightforward guest expectations and respectful use."
          />
          <div className="mt-6 space-y-4">
            {siteContent.houseRules.map((rule) => (
              <div key={rule} className="rounded-[24px] border border-[#f0e1d3] bg-white px-5 py-4 text-sm leading-7 text-[#4e4036]">
                {rule}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


export default About;
