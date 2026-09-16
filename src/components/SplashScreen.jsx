import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 2600);
    const endTimer  = setTimeout(() => onFinish(), 3300);
    return () => { clearTimeout(fadeTimer); clearTimeout(endTimer); };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${isFading ? 'fade-out' : ''}`} aria-hidden="true">
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <img src="/assets/logo.png" alt="Ankita Enterprises" />
        </div>
        <div className="splash-line" />
        <span className="splash-tagline">Luxury Interiors · Mumbai</span>
      </div>
    </div>
  );
};

export default SplashScreen;
