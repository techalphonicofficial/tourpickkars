import TourCard from "@/components/PopularTour/TourCard";
import AvailableTrips from "@/components/TripDetail/AvailableTrips";
import TripContent from "@/components/Trips/TripContent";
import { singleTrips } from "@/services/tripsApi";
import Link from "next/link";
// import TripContent from "@/components/TripContent"; // import client component

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

const getTrips = async (slug) => {
  return await singleTrips(slug);
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trips = await getTrips(slug);
  return {
    title: trips.trip.meta_title,
    description: trips.trip.meta_description,
    keywords: trips.trip.meta_description,
    alternates: {
      canonical: `/trips/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/trips/${slug}`,
      title: trips.trip.meta_title,
      description: trips.trip.meta_description,
      images: [{ url: trips.trip.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: trips.trip.meta_title,
      description: trips.trip.meta_description,
      images: [trips.trip.thumbnail],
    },
  };
}

export default async function Trips({ params }) {
  const { slug } = await params;
  const trips = await getTrips(slug);

  return (
    <>
      {/* Breadcrumb */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: `url('${trips.trip.banner}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            {trips.trip.content && /<h1/i.test(trips.trip.content) ? (
              <div className="breadcumb-title h1">{trips.trip.heading}</div>
            ) : (
              <h1 className="breadcumb-title">{trips.trip.heading}</h1>
            )}
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{trips.trip.heading}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Trip with toggle */}
      <TripContent content={trips.trip.content} />

      {/* Trips Section */}
      <section
        className="tour-area position-relative bg-top-center overflow-hidden"
        id="service-sec"
      >
        <div className="slider-area tour-slider">
          <div className="container th-container my-5">
            <h2 className="fw-bold mb-4 text-center">Available Trips</h2>
            <AvailableTrips trips={trips.packages} />
          </div>
        </div>
      </section>
    </>
  );
}
