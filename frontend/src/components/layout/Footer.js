import React from 'react';
import { Link } from 'react-router-dom';

import { siteContent } from '../../content/siteContent';


const Footer = () => {
  return (
    <footer className="border-t border-[#ead8c8] bg-[#2a221d] text-[#f8efe5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7a17e]">
            Scottsdale rental
          </p>
          <h3 className="mt-3 font-display text-3xl">{siteContent.brand.name}</h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#d8c7b8]">
            A single-property kosher-friendly stay with a warmer inquiry-first experience, tailored for family travel in Scottsdale.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2d9c6]">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#d8c7b8]">
            <li><Link to="/" className="transition hover:text-white">Home</Link></li>
            <li><Link to="/about" className="transition hover:text-white">About the Stay</Link></li>
            <li><Link to="/gallery" className="transition hover:text-white">Gallery</Link></li>
            <li><Link to="/faq" className="transition hover:text-white">FAQ</Link></li>
            <li><Link to="/booking" className="transition hover:text-white">Request Your Stay</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2d9c6]">Stay Details</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[#d8c7b8]">
            <p>{siteContent.brand.address}</p>
            <p>{siteContent.brand.phone}</p>
            <p>
              Questions and stay requests are handled through the site inquiry forms so the owner can respond directly.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs uppercase tracking-[0.18em] text-[#bba594] md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <div>{siteContent.brand.name}</div>
          <div>Inquiry-first launch, payments in phase 2</div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
