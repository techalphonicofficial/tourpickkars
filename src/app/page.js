import Image from "next/image";
// import styles from "./page.module.css";
import Hero from "@/components/Hero/Hero";
import TourCategories from "@/components/TourCategories/TourCategories";
import PopularDestination from "@/components/PopularDestination/PopularDestination";
import AboutSection from "@/components/AboutSection/AboutSection";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import PopularTour from "@/components/PopularTour/PopularTour";
import WhyUs from "@/components/WhyChooseUs/WhyUs";
import AdvertisementSectionCard from "@/components/AdvertisementSection/AdvertisementSectionCard";
import VideosSection from "@/components/VideosSection/VideosSection";
import { getPagewithSection } from "@/services/pageSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";



async function getHomeData() {
  try {
    const data = await getPagewithSection(1);
    return { data, error: null };
  } catch (err) {
    console.error("Failed to fetch home page data:", err);
    return { data: null, error: "Failed to load content" };
  }
}

export async function generateMetadata() {
  const { data } = await getHomeData();
  // console.log("gome scheama", data)

  if (!data) {
    return {
      title: "Enlive Trips",
      description: "Content temporarily unavailable – please try again later",
    };
  }

  return {
    title: data.meta_title,
    description: data.meta_description,
    keywords: data.meta_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_description,
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta_title,
      description: data.meta_description,
      // images: [...]
    },
  };
}

export default async function Home() {
  const { data } = await getHomeData();
  return (
    <>

      {data.addon_schemas.map((schema) => (
        <script
          key={schema.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema.schema }}
        />
      ))}
      <Hero />
      <AdvertisementSectionCard />
      <TourCategories />
      {/* <PopularDestination /> */}
      <PopularDestination />
      <PopularTour />
      <VideosSection />
      <AboutSection />
      {/* <VideosSection /> */}
      <TestimonialSection />
      <BlogSection />
      <WhyUs />
    </>
  );
}
