import Header from "./components/Header";
import DeferredSections from "./components/DeferredSections";
import HomeHero from "./Home/Hero-Section/page";

export const dynamic = "force-static";
export const revalidate = 60 * 60; // refresh static shell hourly

export default function Home() {
  return (
    <div>
      <Header />
      <HomeHero />
      <DeferredSections />
    </div>
  );
}
