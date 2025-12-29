"use client";

import nextDynamic from "next/dynamic";

type HeaderTheme = "light" | "dark";

const AboutPage = nextDynamic(
  // ensure the promise resolves to the component (not the module object)
  () => import("../Home/Hero-Section/About-Us/page").then((m) => m.default),
  {
    loading: () => (
      <SectionSkeleton
        id="about"
        title="Preparing about section..."
        theme="dark"
      />
    ),
  }
);

const ServicesSection = nextDynamic(
  () => import("../Home/Hero-Section/Services/page").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton
        id="services"
        title="Preparing services..."
        theme="light"
      />
    ),
  }
);

const GallerySection = nextDynamic(
  () => import("../Home/Hero-Section/Gallery-Section/page").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton
        id="gallery"
        title="Loading gallery..."
        theme="light"
      />
    ),
  }
);

const ScheduleSection = nextDynamic(
  () => import("../Home/Hero-Section/Schedule-Section/page").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton
        id="Schedule-Section"
        title="Warming up schedule call-to-action..."
        theme="dark"
      />
    ),
  }
);

const FaqsPage = nextDynamic(
  () => import("../Home/Hero-Section/Faqs/page").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <SectionSkeleton id="faqs" title="Fetching FAQs..." theme="light" />
    ),
  }
);

function SectionSkeleton({
  title,
  id,
  theme = "light",
}: {
  title: string;
  id?: string;
  theme?: HeaderTheme;
}) {
  return (
    <section
      id={id}
      data-header-theme={theme}
      className="py-24 px-4 sm:px-8 lg:px-16"
      aria-live="polite"
    >
      <div className="max-w-5xl mx-auto h-24 rounded-3xl bg-gray-100 animate-pulse" />
      <p className="sr-only">{title}</p>
    </section>
  );
}

export default function DeferredSections() {
  return (
    <>
      <AboutPage />
      <ServicesSection />
      <GallerySection />
      <ScheduleSection />
      <FaqsPage />
    </>
  );
}