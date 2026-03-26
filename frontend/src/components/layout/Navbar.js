import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { siteContent } from '../../content/siteContent';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Request Your Stay', path: '/booking' },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-[rgba(252,246,239,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-[#2f241d] transition hover:text-[#9a5a36]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a5a36]">
              Scottsdale stay
            </span>
            <span className="font-display text-2xl leading-none">
              {siteContent.brand.shortName}
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-3">
            {siteContent.quickLinks.map((item) => (
              <Link
                key={item.href}
                to={`/${item.href}`}
                className="rounded-full border border-[#ead8c8] bg-white/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6e5949] transition hover:border-[#c88b61] hover:text-[#9a5a36]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                item.path === '/booking'
                  ? 'bg-[#9a5a36] text-white hover:bg-[#7f4525]'
                  : 'text-[#4e4036] hover:bg-white hover:text-[#9a5a36]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-full border border-[#d9c2ac] p-2 text-[#5f5348] hover:bg-white"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <motion.div
        className={`${isMobileMenuOpen ? 'block' : 'hidden'} border-t border-white/70 bg-[rgba(252,246,239,0.96)] md:hidden`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium ${
                item.path === '/booking'
                  ? 'bg-[#9a5a36] text-white'
                  : 'bg-white/70 text-[#4e4036]'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};


export default Navbar;
