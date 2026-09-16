import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#about',     label: 'About'     },
  { href: '#services',  label: 'Services'  },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process',   label: 'Process'   },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const close = () => setIsMobileOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container navbar-container">
        <a href="#home" className="nav-logo" onClick={close} aria-label="Ankita Enterprises — Home">
          <img src="/assets/logo.png" alt="Ankita Enterprises" />
        </a>

        <button
          className="hamburger"
          onClick={() => setIsMobileOpen(p => !p)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          <span className={`bar ${isMobileOpen ? 'active' : ''}`} />
          <span className={`bar ${isMobileOpen ? 'active' : ''}`} />
          <span className={`bar ${isMobileOpen ? 'active' : ''}`} />
        </button>

        <ul className={`nav-links ${isMobileOpen ? 'active' : ''}`} role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={close}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="nav-cta" onClick={close}>Get a Quote</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
