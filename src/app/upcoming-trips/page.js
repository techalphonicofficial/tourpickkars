import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import UpcomingTripSection from "@/components/UpcomingTripSection/UpcomingTripSection";
import { getPagewithSection } from "@/services/pageSection";
import { tripsWithPackagecount } from "@/services/tripsApi";
import UpcomingTripMain from "@/components/UpcomingTripSection/UpcomingTripMain";
import { getCanonicalUrl } from "@/utils/getCanonical";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";




async function getUpcomingData() {
  try {
    const data = await getPagewithSection(4);
    return { data, error: null };
  } catch (err) {
    console.error("Failed to fetch upcoming page data:", err);
    return { data: null, error: "Failed to load content" };
  }
}

export async function generateMetadata() {
  const { data } = await getUpcomingData();

  if (!data) {
    return {
      title: "Tourpickkars",
      description: "Content temporarily unavailable – please try again later",
    };
  }

  return {
    title: data?.meta_title || "Tourpickkars",
    description: data?.meta_description || "",
    keywords: data?.meta_description || "",
    alternates: {
      canonical: getCanonicalUrl(`/upcoming-trips`),
    },

    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/upcoming-trips`,
      title: data?.meta_title || "Tourpickkars",
      description: data?.meta_description || "",
      keywords: data?.meta_description || "",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.meta_title || "Tourpickkars",
      description: data?.meta_description || "",
      // images: [...]
    },
  };
}

export default async function UpcomingTrips() {
  const mainpage = await getPagewithSection(4);
  const tripsWithcount = await tripsWithPackagecount();

  return (
    <>
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_MEDIA_PATH +
            (mainpage?.sections?.[0]?.section?.[0]?.data?.image || '')
            }')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">
              {mainpage?.sections?.[0]?.section?.[1]?.data?.Text || 'Upcoming Trips'}
            </h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{mainpage?.sections?.[0]?.section?.[1]?.data?.Text || 'Upcoming Trips'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container th-container space">
        <UpcomingTripMain tripsWithcount={tripsWithcount} />
      </div>
    </>
  );
}
