import React, { useState, useRef, useCallback } from 'react';
import './BeforeAfterSlider.css';

const PAIRS = [
  {
    id: 'kitchen',
    label: 'Modular Kitchen',
    beforeImg: '/assets/3d_kitchen_raw.jpg',
    afterImg: '/assets/3d_kitchen.jpg',
    beforeLabel: 'Raw Execution',
    afterLabel: 'Handover Finish',
  },
  {
    id: 'living',
    label: 'Living Suite',
    beforeImg: '/assets/raw_project_1.jpg',
    afterImg: '/assets/real_project_1.jpg',
    beforeLabel: 'Civil Phase',
    afterLabel: 'Completed Space',
  },
];

const BeforeAfterSlider = () => {
  const [activePair, setActivePair] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((p) => Math.max(0, p - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((p) => Math.min(100, p + 5));
    }
  };

  const current = PAIRS[activePair];

  return (
    <section className="section section-dark ba-section" aria-label="Transformation Showcase">
      <div className="container ba-container">
        <div className="ba-header reveal">
          <span className="section-eyebrow">Transformation</span>
          <h2 className="section-title">From Raw Shell to Masterpiece</h2>
          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-dot" />
          </div>

          <div className="ba-selector" role="tablist">
            {PAIRS.map((pair, index) => (
              <button
                key={pair.id}
                role="tab"
                aria-selected={activePair === index}
                className={`ba-tab ${activePair === index ? 'active' : ''}`}
                onClick={() => {
                  setActivePair(index);
                  setSliderPos(50);
                }}
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className="ba-frame reveal"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuenow={Math.round(sliderPos)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Drag before and after image comparison slider"
        >
          <img src={current.afterImg} alt={current.afterLabel} className="ba-image" />

          <div className="ba-clip" style={{ width: `${sliderPos}%` }}>
            <img
              src={current.beforeImg}
              alt={current.beforeLabel}
              style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            />
          </div>

          <div className="ba-divider" style={{ left: `${sliderPos}%` }}>
            <div className="ba-handle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          <span className="ba-badge ba-badge--left">{current.beforeLabel}</span>
          <span className="ba-badge ba-badge--right">{current.afterLabel}</span>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
