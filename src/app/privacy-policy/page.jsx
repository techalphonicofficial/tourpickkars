export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { getPagewithSection } from '@/services/pageSection';
import Link from 'next/link'
import React from 'react'


export async function generateMetadata({ params }) {
  const { slug } = await params;
const mainpage = await getPagewithSection(8);

  return {
    title: mainpage.meta_title,
    description: mainpage.meta_description,
    keywords: mainpage.meta_description,
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      title: mainpage.meta_title,
      description: mainpage.meta_description,
      keywords: mainpage.meta_description,
      // images: [{ url: page.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: mainpage.meta_title,
      description: mainpage.meta_description,
      // images: [blog.blog.image],
    },
  };
}
export default async function PrivacyPolicy() {
  const mainpage = await getPagewithSection(8);
  return (
    <>
        {/* Breadcrumb */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: "url('/img/bg/breadcumb-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">{mainpage.name}</h1>
            <ul className="breadcumb-menu">
              <li><Link href="/">Home</Link></li>
              <li>{mainpage.name}</li>
            </ul>
          </div>
        </div>
      </div>



        <section className="space">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12 col-lg-12">
            <div className="page-single">
              <div className="service-img global-img">
                <img src="assets/img/normal/resort-details.jpg" alt={mainpage.name || "Privacy policy banner"} />
              </div>
              <div className="page-content d-block">
                <div
                  dangerouslySetInnerHTML={{
                    __html: mainpage.sections[0].section[0].data.rich_text,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>




    </>
  )
}
