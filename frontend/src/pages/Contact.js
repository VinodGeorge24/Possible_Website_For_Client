import React from 'react';

import PageBanner from '../components/common/PageBanner';
import SectionTitle from '../components/common/SectionTitle';
import ContactInquiryForm from '../components/forms/ContactInquiryForm';
import { siteContent } from '../content/siteContent';
import locationMap from '../assets/images/for_map_placeholder.jpg';


const Contact = () => {
  return (
    <div className="space-y-10">
      <PageBanner
        eyebrow="Contact"
        title="Questions about the home, the kosher setup, or your travel dates?"
        description="Use the form below and the site will route your message through the backend so the client receives it in the shared inquiry inbox."
      />

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] border border-[#ead8c8] bg-[#fff9f3] p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Property details"
            title="A warm Scottsdale base with a direct response path"
            description="The site is designed so both general questions and stay requests go to the same managed inbox, keeping follow-up simple for the client."
          />

          <div className="mt-6 overflow-hidden rounded-[28px] shadow-[0_12px_35px_rgba(77,52,36,0.12)]">
            <img src={locationMap} alt="Scottsdale location placeholder" className="h-72 w-full object-cover" />
          </div>

          <div className="mt-6 space-y-4 text-sm leading-7 text-[#5f5348]">
            <p><strong className="text-[#2f241d]">Address:</strong> {siteContent.brand.address}</p>
            <p><strong className="text-[#2f241d]">Phone:</strong> {siteContent.brand.phone}</p>
            <p>
              Guests can use this form for kosher-related questions, family stay planning, timing details, or a first pass on availability.
            </p>
          </div>
        </div>

        <div className="rounded-[34px] border border-[#ead8c8] bg-white/90 p-8 shadow-[0_18px_55px_rgba(77,52,36,0.08)]">
          <SectionTitle
            eyebrow="Send a question"
            title="Reach out directly"
            description="The message is stored in the backend and also sent to the configured inquiry inbox, so nothing depends on client-side email tricks."
          />
          <div className="mt-8">
            <ContactInquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
};


export default Contact;
