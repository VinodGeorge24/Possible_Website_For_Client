import React from 'react';

import PageBanner from '../components/common/PageBanner';
import { siteContent } from '../content/siteContent';


const Gallery = () => {
  return (
    <div className="space-y-10">
      <PageBanner
        eyebrow="Gallery"
        title="A visual story built around light, space, and a warmer Scottsdale mood."
        description="The gallery should feel polished and calm, with imagery doing most of the selling instead of cluttered copy blocks."
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {siteContent.gallery.map((image, index) => (
          <article
            key={image.id}
            className={`overflow-hidden rounded-[32px] border border-[#ead8c8] bg-white shadow-[0_18px_55px_rgba(77,52,36,0.1)] ${
              index === 0 ? 'md:col-span-2 xl:row-span-2' : ''
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full object-cover ${index === 0 ? 'h-[460px]' : 'h-72'}`}
            />
            <div className="p-6">
              <h2 className="font-display text-3xl text-[#2f241d]">{image.alt}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f5348]">{image.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};


export default Gallery;
