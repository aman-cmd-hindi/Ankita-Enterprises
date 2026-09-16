import React, { useState } from 'react';
import './ClientSpotlights.css';

const SPOTLIGHTS = [
  {
    id: 1,
    quote: 'Complete 3,400 sq.ft civil restructure, Italian marble flooring, bespoke walnut furniture, and concealed smart lighting delivered on schedule in 90 days. Exceptional professionalism.',
    client: 'Dr. A. Mehta',
    location: 'Hiranandani Gardens, Powai',
  },
  {
    id: 2,
    quote: 'From bare concrete shell to move-in perfection. The glass partition and custom master bedroom woodwork exceeded our highest expectations. Truly Mumbai’s finest turnkey team.',
    client: 'Vikram & Sanya S.',
    location: 'Pali Hill, Bandra West',
  },
  {
    id: 3,
    quote: 'Flawless electrical planning, acoustic false ceilings, and precision reception fabrication for our corporate office. Transparent cost accounting with zero surprises.',
    client: 'Rajesh K., Managing Director',
    location: 'One BKC, Bandra Kurla Complex',
  },
];

const FAQS = [
  {
    q: 'What is included in your turnkey contract?',
    a: 'We take complete end-to-end responsibility from bare shell to final handover: civil restructuring (demolition, plaster, tiling, waterproofing), electrical and lighting planning, false ceilings, modular kitchens and bespoke furniture manufacturing via Ankita Furniture Work, painting, and deep cleaning before key handover.',
  },
  {
    q: 'How are project timelines and quality managed?',
    a: 'Before breaking ground, you receive a detailed Gantt chart schedule with clear phase milestones. A senior site engineer supervises civil, MEP, and carpentry craftsmen daily to ensure rigorous adherence to safety, tolerances, and design specifications.',
  },
  {
    q: 'Can I provide my own 3D design references?',
    a: 'Yes. Most of our clients provide their own 3D renders, moodboards, or architect drawings. Our engineering team reviews the technical specifications, aligns finishes, and executes the physical build with laser precision to match your approved 3D reference.',
  },
  {
    q: 'Do you offer post-handover warranty and support?',
    a: 'Yes. Every project is backed by our post-completion warranty covering furniture joinery, hardware fittings, electrical circuits, and civil finishes. We maintain long-term relationships with every client we serve.',
  },
];

const ClientSpotlights = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section className="section spotlight-section" aria-label="Client Trust and FAQs">
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Client Experience</span>
          <h2 className="section-title">Trusted by Discerning Clients</h2>
          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-dot" />
          </div>
        </div>

        <div className="spotlight-grid stagger">
          {SPOTLIGHTS.map((item) => (
            <div key={item.id} className="spotlight-card reveal">
              <div>
                <div className="spotlight-stars" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="spotlight-text">“{item.quote}”</p>
              </div>

              <div className="spotlight-meta">
                <h4>{item.client}</h4>
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-eyebrow">Clarity & Confidence</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="section-divider" aria-hidden="true">
              <div className="section-divider-dot" />
            </div>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className={`faq-item ${openFaq === index ? 'active' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientSpotlights;
