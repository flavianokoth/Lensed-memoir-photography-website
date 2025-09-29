import React from 'react'
import Header from './components/Header'
import HomeHero from './Home/Hero-Section/page'
import AboutPage from './Home/Hero-Section/About-Us/page'
import ServicesSection from './Home/Hero-Section/Services/page'
import GallerySection from './Home/Hero-Section/Gallery-Section/page'
import ScheduleSection from './Home/Hero-Section/Schedule-Section/page'
import SendMessageSection from './Home/Hero-Section/contact-us/page'
import FaqPage from './Home/Hero-Section/Faqs/page'

export default function Home() {
  return (
    
    <div>
      <Header />
      <HomeHero />
      <AboutPage />
      <ServicesSection />
      <GallerySection />
      <ScheduleSection />
      <SendMessageSection />
      <FaqPage />
    </div>
  )
}
