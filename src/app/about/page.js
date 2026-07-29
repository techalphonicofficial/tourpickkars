
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { getPagewithSection } from "@/services/pageSection";
import Image from "next/image";
import Link from "next/link";

async function getAboutData() {
  try {
    const data = await getPagewithSection(3);
    return { data, error: null };
  } catch (err) {
    console.error("Failed to fetch about page data:", err);
    return { data: null, error: "Failed to load content" };
  }
}

export async function generateMetadata() {
  const { data } = await getAboutData();

  if (!data) {
    return {
      title: "About Us",
      description: "Content temporarily unavailable – please try again later",
    };
  }

  return {
    title: data.meta_title,
    description: data.meta_description,
    keywords: data.meta_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_description,
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta_title,
      description: data.meta_description,
    },
  };
}

export default async function About() {
  const { data: mainpage, error } = await getAboutData();

  if (error || !mainpage) {
    return (
      <div className="p-10 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Content</h1>
        <p className="text-lg mb-6">{error || "Please try again later or contact support."}</p>
        <Link href="/" className="th-btn style3">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {mainpage.addon_schemas.map((schema) => (
        <script
          key={schema.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema.schema }}
        />
      ))}

      {/* Breadcrumb */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.sections[0].section[1].data.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">
              {mainpage.sections[0].section[0].data.Text}
            </h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{mainpage.sections[0].section[0].data.Text}</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="about-area position-relative overflow-hidden space"
        id="about-sec"
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="img-box3">
                <div className="img1">
                  <img
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.sections[1].section[0].data.image}
                    alt="About"
                  />
                </div>
                <div className="img2">
                  <img
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.sections[1].section[1].data.image}
                    alt="About"
                  />
                </div>
                <div className="img3 movingX">
                  <img
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.sections[1].section[2].data.image}
                    alt="About"
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="ps-xl-4">
                <div className="title-area mb-20">
                  <span className="sub-title style1">
                    {mainpage.sections[1].section[3].data.Text}
                  </span>
                  <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                    {mainpage.sections[1].section[4].data.Text}
                  </h2>
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: mainpage.sections[1].section[5].data.rich_text,
                  }}
                />

                <div className="about-item-wrap">
                  {mainpage.sections[1].section
                    .slice(6, 9)
                    .map((item, index) => (
                      <div className="about-item style2" key={index}>
                        <div className="about-item_img">
                          <img
                            src={process.env.NEXT_PUBLIC_MEDIA_PATH + item.data.section[0].data.image}
                            alt=""
                          />
                        </div>
                        <div className="about-item_centent">
                          <h3 className="box-title h5">{item.data.section[1].data.Text}</h3>
                          <p className="about-item_text">
                            {item.data.section[2].data.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-35">
                  <Link
                    href="/contact"
                    className="th-btn style3 th-icon"
                  >
                    Contact With Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
