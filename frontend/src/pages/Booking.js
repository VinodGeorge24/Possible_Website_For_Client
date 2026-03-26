import React from 'react';

import PageBanner from '../components/common/PageBanner';
import SectionTitle from '../components/common/SectionTitle';
import BookingRequestForm from '../components/forms/BookingRequestForm';
import { siteContent } from '../content/siteContent';


const Booking = () => {
  return (
    <div className="space-y-10">
      <PageBanner
        eyebrow="Request your stay"
        title="Capture the inquiry now, confirm the details in a direct follow-up."
        description="This public launch is intentionally inquiry-first. Guests can share dates and questions, and the owner can respond personally before a booking is finalized."
      />

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[34px] border border-[#ead8c8] bg-white/90 p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Stay request form"
            title="Tell us about your dates and group"
            description="Use the notes field for kosher questions, pool-heating requests, or anything your group needs before a stay can be confirmed."
          />
          <div className="mt-8">
            <BookingRequestForm />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[34px] border border-[#ead8c8] bg-[linear-gradient(145deg,rgba(255,251,246,0.96),rgba(247,236,225,0.9))] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
            <SectionTitle
              eyebrow="What happens next"
              title="A higher-touch booking conversation"
              description="The goal of this flow is to make the client site sellable now, while keeping payments and true confirmation logic in a later phase."
            />
            <div className="mt-6 space-y-4">
              {siteContent.process.map((step, index) => (
                <div key={step.title} className="rounded-[24px] bg-white/80 px-5 py-4 shadow-[0_10px_28px_rgba(77,52,36,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a5a36]">Step {index + 1}</p>
                  <h3 className="mt-3 font-display text-2xl text-[#2f241d]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f5348]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[#dfe5d2] bg-[linear-gradient(145deg,rgba(247,250,241,0.98),rgba(232,239,221,0.88))] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
            <SectionTitle
              eyebrow="Good to know"
              title="Best fit for this version of the site"
              description="This relaunch focuses on premium presentation, kosher positioning, and dependable lead capture. Live payments, refunds, and availability enforcement are intentionally deferred."
            />
          </div>
        </div>
      </section>
    </div>
  );
};


export default Booking;
