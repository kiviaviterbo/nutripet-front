import React, { useEffect } from 'react';
import NutripetNavbar from '../components/Navbar/Navbar';
import HeroSection from '../components/HeroSection/HeroSection';
import AboutSection from '../components/AboutSection/AboutSection';
import PlansSection from '../components/PlansSection/PlansSection';
import Footer from '../components/Footer/Footer';
import '../assets/styles/global.css';

export default function Home() {
  useEffect(() => {
    const sectionId = sessionStorage.getItem('scrollTo');
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      sessionStorage.removeItem('scrollTo');
    }
  }, []);
  return (
    <>
      <NutripetNavbar />
      <HeroSection />
      <AboutSection />
      <PlansSection />
      <Footer />
    </>
  );
}
