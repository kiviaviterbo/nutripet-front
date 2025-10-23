import React from 'react';
import NutripetNavbar from '../components/Navbar/Navbar';
import HeroSection from '../components/HeroSection/HeroSection';
import AboutSection from '../components/AboutSection/AboutSection';
import PlansSection from '../components/PlansSection/PlansSection';
import Footer from '../components/Footer/Footer';
import '../assets/styles/global.css';

export default function Home() {
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
