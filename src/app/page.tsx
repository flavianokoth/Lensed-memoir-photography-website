import React from 'react'
import Header from './components/Header'
import HomeHero from './Home/Hero-Section/page'
import AboutPage from './Home/Hero-Section/About-Us/page'

export default function Home() {
  return (
    
    <div>
      <Header />
      <HomeHero />
      <AboutPage />
    </div>
  )
}
