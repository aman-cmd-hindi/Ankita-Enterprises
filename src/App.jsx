import React, { useEffect, useState, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Button from './components/Button';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import HeroRoom3D from './components/HeroRoom3D';
import FloatingCTA from './components/FloatingCTA';
import './App.css';

/* ── Scroll reveal hook ── */
function useReveal() {
  useEffect(() => {
    const opts = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, opts);

    document.querySelectorAll('.reveal, .animate-on-scroll').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Gallery data ── */
const ALL_PROJECTS = [
  { id: 1,  src: '/assets/real_project_1.jpg',   title: 'Premium Living Space',      cat: 'Turnkey'    },
  { id: 2,  src: '/assets/real_project_2.jpg',   title: 'Elegant Glass Partition',   cat: 'Turnkey'    },
  { id: 3,  src: '/assets/real_project_3.jpg',   title: 'Modern Workspace',          cat: 'Furniture'  },
  { id: 4,  src: '/assets/3d_living_space.jpg',  title: 'Luxury Living Space',       cat: '3D Design'  },
  { id: 5,  src: '/assets/3d_bedroom.jpg',       title: 'Elegant Master Bedroom',    cat: '3D Design'  },
  { id: 6,  src: '/assets/3d_bathroom.jpg',      title: 'Spa-Style Bathroom',        cat: '3D Design'  },
  { id: 7,  src: '/assets/3d_kitchen.jpg',       title: 'Modular Kitchen & Dining',  cat: '3D Design'  },
  { id: 8,  src: '/assets/3d_kitchen_raw.jpg',   title: 'Kitchen Transformation',    cat: 'Turnkey'    },
  { id: 9,  src: '/assets/raw_project_1.jpg',    title: 'Site Execution — Phase I',  cat: 'Turnkey'    },
  { id: 10, src: '/assets/raw_project_2.jpg',    title: 'Site Execution — Phase II', cat: 'Turnkey'    },
  { id: 11, src: '/assets/project_bedroom.jpg',  title: 'Custom Bedroom Suite',      cat: 'Furniture'  },
  { id: 12, src: '/assets/project_kitchen.jpg',  title: 'Premium Modular Kitchen',   cat: 'Furniture'  },
];

const FILTER_LABELS = ['All', 'Turnkey', 'Furniture', '3D Design'];

/* ── Service data ── */
const SERVICES = [
  {
    title: 'Turnkey Interior Design',
    desc:  'Complete end-to-end transformation — from bare shell to a fully furnished, move-in-ready masterpiece. One point of contact, zero headaches.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'Civil Work',
    desc:  'Structural modifications, flooring, tiling, false ceilings, plastering, and all civil construction — executed with precision and quality materials.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
      </svg>
    ),
  },
  {
    title: 'Electrical Work',
    desc:  'Complete electrical planning and installation: concealed wiring, modular switches, smart lighting circuits, and power point layouts.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Furniture & Modular Solutions',
    desc:  'Bespoke wardrobes, modular kitchens, TV units, and custom furniture crafted by Ankita Furniture Work — premium materials, flawless finish.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3"/><path d="M2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5a1 1 0 00-1-1H3a1 1 0 00-1 1z"/><path d="M6 18v3M18 18v3"/>
      </svg>
    ),
  },
  {
    title: 'Ceiling & Lighting Design',
    desc:  'Elegant false ceilings, cove lighting, pop and gypsum work, and curated lighting layouts that set the perfect ambience for every room.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
];

/* ── Process steps ── */
const STEPS = [
  {
    num: '01',
    title: 'Consultation',
    desc: 'We visit your site, understand your vision, budget, and timeline. A detailed scope is prepared.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Design & Client 3D Reference',
    desc: 'You share your vision — mood boards, 3D renders, or reference images. We align on every detail, material, and finish before a single nail is hammered.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Execution',
    desc: 'Our skilled craftsmen begin work — civil, electrical, furniture, and finishing — with strict quality control at every stage.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Handover',
    desc: 'Your space is handed over spotless — cleaned, snagged, and ready. We remain available for post-completion support.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });
  const [form, setForm] = useState({ name: '', phone: '', type: '', message: '' });

  useReveal();

  /* Gallery items matching current filter */
  const filtered = activeFilter === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.cat === activeFilter);

  /* Lightbox helpers */
  const openLightbox = (idx) => setLightbox({ open: true, idx });
  const closeLightbox = useCallback(() => setLightbox(lb => ({ ...lb, open: false })), []);
  const prevImg = () => setLightbox(lb => ({ ...lb, idx: (lb.idx - 1 + filtered.length) % filtered.length }));
  const nextImg = () => setLightbox(lb => ({ ...lb, idx: (lb.idx + 1) % filtered.length }));

  /* Keyboard nav for lightbox */
  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e) => {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevImg();
      if (e.key === 'ArrowRight') nextImg();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open, closeLightbox]);

  /* Form submit → WhatsApp */
  const handleSubmit = (e) => {
    e.preventDefault();
    const text =
      `Hello Ankita Enterprises! 👋\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Project Type: ${form.type}\n\n` +
      `Message:\n${form.message}`;
    window.open(`https://wa.me/919323389351?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Lightbox */}
      {lightbox.open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={closeLightbox}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img
              key={filtered[lightbox.idx]?.id}
              src={filtered[lightbox.idx]?.src}
              alt={filtered[lightbox.idx]?.title}
              className="lightbox-img"
            />
            <div className="lightbox-caption">
              <div className="lightbox-caption-title">{filtered[lightbox.idx]?.title}</div>
              <div className="lightbox-caption-cat">{filtered[lightbox.idx]?.cat}</div>
            </div>
          </div>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">✕</button>
          <button className="lightbox-nav lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); prevImg(); }} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="lightbox-nav lightbox-nav--next" onClick={(e) => { e.stopPropagation(); nextImg(); }} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div className="lightbox-counter">{lightbox.idx + 1} / {filtered.length}</div>
        </div>
      )}

      <div className="app">
        <Navbar />
        <FloatingCTA />

        {/* ══════════ HERO ══════════ */}
        <section id="home" className="hero-section" aria-label="Hero">
          {/* Three.js 3D Room */}
          <HeroRoom3D />

          {/* Gradient overlay */}
          <div className="hero-overlay" aria-hidden="true" />

          {/* Content */}
          <div className="container hero-content fade-in">
            <p className="hero-eyebrow">Ankita Enterprises · Est. 2004 · Mumbai</p>
            <h1 className="hero-title">
              Where Spaces<br />
              Become <em>Masterpieces</em>
            </h1>
            <p className="hero-subtitle">
              20+ years of turnkey interior expertise — furniture, civil, electrical, and complete
              design execution for discerning homes and businesses across Mumbai.
            </p>
            <div className="hero-cta">
              <a href="#portfolio">
                <Button variant="primary">View Our Work</Button>
              </a>
              <a href="#contact">
                <Button variant="outline">Get a Quote</Button>
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="hero-stats" aria-label="Key statistics">
            <div className="container hero-stats-inner">
              <div className="hero-stat">
                <span className="hero-stat-num">20+</span>
                <span className="hero-stat-label">Years Experience</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat">
                <span className="hero-stat-num">200+</span>
                <span className="hero-stat-label">Projects Delivered</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat">
                <span className="hero-stat-num">100%</span>
                <span className="hero-stat-label">Turnkey Delivery</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat">
                <span className="hero-stat-num">Mumbai</span>
                <span className="hero-stat-label">Based & Operated</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ ABOUT ══════════ */}
        <section id="about" className="section section-marble" aria-label="About Ankita Enterprises">
          <div className="container">
            <div className="about-grid">
              {/* Images */}
              <div className="about-image-wrap reveal reveal--left">
                <img
                  src="/assets/hero_interior.jpg"
                  alt="Premium interior by Ankita Enterprises"
                  className="about-image-main"
                  loading="lazy"
                />
                <img
                  src="/assets/3d_living_space.jpg"
                  alt="3D interior visualisation"
                  className="about-image-accent"
                  loading="lazy"
                />
                <div className="about-gold-bar" aria-hidden="true" />
              </div>

              {/* Copy */}
              <div className="about-content reveal reveal--right">
                <span className="section-eyebrow">About Us</span>
                <h2 className="section-title section-title--left" style={{ textAlign: 'left', fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}>
                  Two Decades of Crafting<br />
                  <em>Extraordinary Spaces</em>
                </h2>
                <p className="about-body">
                  Founded in 2004, <strong>Ankita Enterprises</strong> and <strong>Ankita Furniture Work</strong> have grown
                  into Mumbai's most trusted name in premium turnkey interior contracting. From Powai to South
                  Mumbai, our projects span luxury residences, corporate offices, and hospitality spaces.
                </p>
                <p className="about-body">
                  We don't just design — we build. Every project is a seamless end-to-end execution: 
                  civil work, electrical, custom furniture, and final finishing. One team, one vision, zero compromise.
                </p>
                <div className="about-highlights">
                  {[
                    { t: 'Turnkey Specialists',      d: 'Civil · Electrical · Furniture · Finishing — all under one roof.' },
                    { t: 'Modern Design Language',    d: 'Contemporary aesthetics tailored to your lifestyle and taste.' },
                    { t: "Mumbai\u2019s Trusted Name",  d: '200+ projects delivered across residential & commercial sectors.' },
                  ].map(({ t, d }) => (
                    <div className="about-highlight" key={t}>
                      <div className="about-highlight-dot" aria-hidden="true" />
                      <p><strong>{t}</strong> — {d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ SERVICES ══════════ */}
        <section id="services" className="section section-dark services-section" aria-label="Our Services">
          <div className="container">
            <div className="services-header reveal">
              <span className="section-eyebrow">What We Do</span>
              <h2 className="section-title">Our Expertise</h2>
              <div className="section-divider" aria-hidden="true">
                <div className="section-divider-dot" />
              </div>
              <p className="services-subtitle">
                From a bare concrete shell to a fully finished luxury space — we handle every trade, every detail.
              </p>
            </div>

            <div className="services-grid stagger">
              {SERVICES.map((svc) => (
                <div key={svc.title} className="service-card reveal">
                  <div className="service-icon-wrap" aria-hidden="true">
                    {svc.icon}
                  </div>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ PORTFOLIO ══════════ */}
        <section id="portfolio" className="section section-dark portfolio-section" aria-label="Portfolio">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span className="section-eyebrow">Our Work</span>
              <h2 className="section-title">Featured Projects</h2>
              <div className="section-divider" aria-hidden="true">
                <div className="section-divider-dot" />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="portfolio-filters reveal" role="group" aria-label="Portfolio filters">
              {FILTER_LABELS.map(label => (
                <button
                  key={label}
                  className={`filter-btn ${activeFilter === label ? 'active' : ''}`}
                  onClick={() => setActiveFilter(label)}
                  aria-pressed={activeFilter === label}
                  id={`filter-${label.replace(' ', '-').toLowerCase()}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Masonry gallery */}
            <div className="portfolio-masonry" role="list">
              {filtered.map((p, idx) => (
                <div
                  key={p.id}
                  className="portfolio-item reveal"
                  role="listitem"
                  onClick={() => openLightbox(idx)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
                  aria-label={`View ${p.title}`}
                  id={`portfolio-item-${p.id}`}
                >
                  <img
                    src={p.src}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="portfolio-item-info" aria-hidden="true">
                    <div className="portfolio-item-title">{p.title}</div>
                    <div className="portfolio-item-cat">{p.cat}</div>
                  </div>
                  <div className="portfolio-expand-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ PROCESS ══════════ */}
        <section id="process" className="section section-marble" aria-label="Our Process">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span className="section-eyebrow">How We Work</span>
              <h2 className="section-title">The Ankita Method</h2>
              <div className="section-divider" aria-hidden="true">
                <div className="section-divider-dot" />
              </div>
            </div>

            <div className="process-timeline stagger">
              {STEPS.map((step) => (
                <div key={step.num} className="process-step reveal">
                  <div className="process-step-num" aria-hidden="true">{step.num}</div>
                  <div className="process-step-content">
                    <div className="process-step-icon" aria-hidden="true">{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CONTACT ══════════ */}
        <section id="contact" className="section section-dark" aria-label="Contact Ankita Enterprises">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="section-eyebrow">Get In Touch</span>
              <h2 className="section-title">Start Your Project</h2>
              <div className="section-divider" aria-hidden="true">
                <div className="section-divider-dot" />
              </div>
            </div>

            <div className="contact-grid">
              {/* Left — info */}
              <div className="contact-info reveal reveal--left">
                <p className="contact-info-body">
                  Ready to transform your space? Reach out for a free consultation. We work across
                  residential and commercial projects across Mumbai with a quick turnaround from concept to completion.
                </p>

                <div className="contact-items">
                  <div className="contact-item">
                    <div className="contact-item-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                    </div>
                    <div className="contact-item-text">
                      <strong>Phone</strong>
                      <a href="tel:+919323389351">+91 93233 89351</a><br />
                      <a href="tel:+918898231371">+91 88982 31371</a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-item-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div className="contact-item-text">
                      <strong>Email</strong>
                      <a href="mailto:ankitafurniture@hotmail.com">ankitafurniture@hotmail.com</a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-item-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div className="contact-item-text">
                      <strong>Location</strong>
                      KBM Compound, Sai Karuna Nagar,<br />
                      Pipeline, Saki Vihar, Powai,<br />
                      Mumbai — 400072
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.me/919323389351"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-wa-btn"
                  id="contact-whatsapp-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Right — form */}
              <div className="contact-form-wrap reveal reveal--right">
                <h3 className="contact-form-title">Request a Quote</h3>
                <p className="contact-form-sub">Fill in the details and we'll reach out within 24 hours.</p>

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-name">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-phone">Phone Number</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-type">Project Type</label>
                    <select
                      id="contact-type"
                      required
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="">Select a service…</option>
                      <option value="Turnkey Interior Design">Turnkey Interior Design</option>
                      <option value="Civil Work">Civil Work</option>
                      <option value="Electrical Work">Electrical Work</option>
                      <option value="Furniture & Modular Solutions">Furniture &amp; Modular Solutions</option>
                      <option value="Ceiling & Lighting Design">Ceiling &amp; Lighting Design</option>
                      <option value="Full Consultation">Full Consultation</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us about your project — location, size, budget, timeline…"
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <Button variant="primary" type="submit" full id="contact-submit-btn">
                    Send via WhatsApp →
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
