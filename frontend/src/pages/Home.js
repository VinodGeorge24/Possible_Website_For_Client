import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import SectionTitle from '../components/common/SectionTitle';
import { siteContent } from '../content/siteContent';


const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};


const Home = () => {
  return (
    <div className="space-y-14 pb-6">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_top_left,rgba(216,162,117,0.32),transparent_45%),linear-gradient(135deg,rgba(255,250,245,0.98),rgba(244,229,213,0.95))] p-8 shadow-[0_30px_100px_rgba(76,54,38,0.16)] md:p-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9a5a36]">
            {siteContent.brand.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] text-[#2f241d] md:text-6xl">
            {siteContent.brand.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5348] md:text-lg">
            {siteContent.brand.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-[#9a5a36] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7f4525]"
            >
              Request your stay
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#d7b89d] bg-white/80 px-6 py-3 text-sm font-semibold text-[#4e4036] transition hover:border-[#b16c45] hover:text-[#9a5a36]"
            >
              Ask a question
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {siteContent.quickLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-[#ead8c8] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6e5949] transition hover:border-[#c88b61] hover:text-[#9a5a36]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {siteContent.stats.map((stat) => (
              <div key={stat.label} className="rounded-[28px] border border-white/70 bg-white/65 px-5 py-4 shadow-[0_18px_45px_rgba(70,47,33,0.08)]">
                <div className="font-display text-3xl text-[#2f241d]">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b6757]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[36px] shadow-[0_30px_100px_rgba(76,54,38,0.22)]"
        >
          <img
            src={siteContent.gallery[0].src}
            alt={siteContent.gallery[0].alt}
            className="h-full min-h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,22,16,0.08),rgba(33,22,16,0.62))]" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f4d8c4]">Featured space</p>
            <h2 className="mt-3 font-display text-3xl">{siteContent.gallery[0].alt}</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#f6eadf]">
              {siteContent.gallery[0].description}
            </p>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {siteContent.highlights.map((item, index) => (
          <motion.div
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="rounded-[30px] border border-[#ead8c8] bg-white/85 p-7 shadow-[0_22px_65px_rgba(77,52,36,0.08)]"
          >
            <div className="mb-4 h-12 w-12 rounded-2xl bg-[#f7e6d5]" />
            <h3 className="font-display text-2xl text-[#2f241d]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#5f5348]">{item.description}</p>
          </motion.div>
        ))}
      </section>

      <section id="overview" className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="rounded-[34px] border border-[#ead8c8] bg-[#fff9f4] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Property overview"
            title="A Scottsdale stay shaped for family rhythm"
            description={siteContent.overview.intro}
          />
          <p className="mt-6 text-base leading-8 text-[#5f5348]">{siteContent.overview.body}</p>
        </div>

        <div className="rounded-[34px] border border-[#ead8c8] bg-[linear-gradient(135deg,rgba(255,252,248,0.98),rgba(246,234,220,0.92))] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <h3 className="font-display text-3xl text-[#2f241d]">Stay highlights</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {siteContent.overview.features.map((feature) => (
              <div key={feature} className="rounded-[24px] bg-white/80 px-5 py-4 text-sm font-medium text-[#4e4036] shadow-[0_12px_28px_rgba(77,52,36,0.06)]">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kosher" className="rounded-[36px] border border-[#ead8c8] bg-[#2f241d] px-6 py-10 text-[#f7ede3] shadow-[0_30px_100px_rgba(31,20,14,0.22)] md:px-10">
        <SectionTitle
          eyebrow="Kosher and Shabbos comfort"
          title="A home that can be prepared for a more workable observant stay"
          description="The kosher positioning for this property focuses on reducing arrival friction for families and making a weekend in Scottsdale feel more natural."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {siteContent.kosherAmenities.map((item) => (
            <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-2xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#dbc9ba]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery-preview" className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Gallery preview"
            title="Warm rooms, desert light, and family-friendly spaces"
            description="The visual direction leans clean, comfortable, and premium rather than overstyled. Photography should do the heavy lifting."
          />
          <Link to="/gallery" className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-[#9a5a36] transition hover:text-[#7f4525]">
            View the full gallery
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[34px] shadow-[0_24px_70px_rgba(77,52,36,0.18)]">
            <img src={siteContent.gallery[0].src} alt={siteContent.gallery[0].alt} className="h-full min-h-[420px] w-full object-cover" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {siteContent.gallery.slice(1, 4).map((image) => (
              <div key={image.id} className="overflow-hidden rounded-[30px] border border-[#ead8c8] bg-white shadow-[0_18px_55px_rgba(77,52,36,0.1)]">
                <img src={image.src} alt={image.alt} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-2xl text-[#2f241d]">{image.alt}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#5f5348]">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="grid gap-5 md:grid-cols-3">
        {siteContent.jewishLife.map((item, index) => (
          <motion.div
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="rounded-[30px] border border-[#dfe5d2] bg-[linear-gradient(145deg,rgba(247,250,241,0.98),rgba(232,239,221,0.88))] p-7 shadow-[0_18px_55px_rgba(77,52,36,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f7040]">Jewish life</p>
            <h3 className="mt-4 font-display text-2xl text-[#2f241d]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#5f5348]">{item.description}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-[34px] border border-[#ead8c8] bg-white/85 p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Sleeping layout"
            title="Flexible enough for families and group travel"
            description="The site positioning leans into practical sleeping arrangements because that is one of the strongest decision drivers for kosher family travel."
          />
          <div className="mt-6 space-y-4">
            {siteContent.sleepingArrangements.map((item) => (
              <div key={item} className="rounded-[24px] border border-[#f0e1d3] bg-[#fff8f1] px-5 py-4 text-sm leading-7 text-[#4e4036]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-[#ead8c8] bg-[linear-gradient(145deg,rgba(255,251,246,0.96),rgba(247,236,225,0.9))] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Guest perspective"
            title="Messaging that feels calm, high-touch, and credible"
            description="Rather than promise instant checkout, the home is presented as a premium inquiry-led experience with a direct owner follow-up."
          />
          <div className="mt-6 grid gap-4">
            {siteContent.testimonials.map((item) => (
              <div key={item.label} className="rounded-[26px] bg-white/75 p-6 shadow-[0_10px_30px_rgba(77,52,36,0.08)]">
                <p className="text-base leading-8 text-[#43362d]">"{item.quote}"</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a5a36]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq-preview" className="rounded-[36px] border border-[#ead8c8] bg-[#fff9f3] px-6 py-10 shadow-[0_18px_55px_rgba(77,52,36,0.08)] md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="FAQ preview"
            title="Questions guests usually ask first"
            description="These answers set expectations for an inquiry-first launch while keeping the stay details clear and premium."
          />
          <Link to="/faq" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a5a36] transition hover:text-[#7f4525]">
            Read full FAQ
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {siteContent.faqs.slice(0, 4).map((faq) => (
            <div key={faq.question} className="rounded-[28px] border border-[#ead8c8] bg-white px-6 py-5 shadow-[0_12px_35px_rgba(77,52,36,0.08)]">
              <h3 className="font-display text-2xl text-[#2f241d]">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f5348]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="request" className="rounded-[38px] bg-[linear-gradient(135deg,rgba(154,90,54,0.97),rgba(117,67,41,0.97))] px-6 py-10 text-white shadow-[0_30px_100px_rgba(77,52,36,0.22)] md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5ddcd]">Request your stay</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Capture the lead now, finalize the booking with a personal follow-up.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#fdeee3]">
              This launch focuses on a more polished client presentation and a reliable inquiry workflow. Live checkout stays out of the public path until phase 2.
            </p>
          </div>

          <div className="grid gap-4">
            {siteContent.process.map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-white/15 bg-white/10 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f8d8c1]">Step {index + 1}</p>
                <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#fce9da]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/booking"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#7f4525] transition hover:bg-[#f6ebe1]"
          >
            Open the stay request form
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ask a general question
          </Link>
        </div>
      </section>
    </div>
  );
};


export default Home;
