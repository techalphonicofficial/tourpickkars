// import Image from "next/image";
// import ContactUsForm from "@/components/Contact/ContactUsForm";
// import Link from "next/link";
// import { getPagewithSection } from "@/services/pageSection";
// import { getDestination } from "@/services/destinationApi";

// const mainpage = await getPagewithSection(5);

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   return {
//     title: mainpage.meta_title,
//     description: mainpage.meta_description,
//     keywords: mainpage.meta_description,
//     openGraph: {
//       type: "website",
//       url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
//       title: mainpage.meta_title,
//       description: mainpage.meta_description,
//       keywords: mainpage.meta_description,
//       // images: [{ url: page.image }],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: mainpage.meta_title,
//       description: mainpage.meta_description,
//       // images: [blog.blog.image],
//     },
//   };
// }
// export default async function Contact() {
//   return (
//     <>
//         <div
//       className="breadcumb-wrapper"
//       style={{
//         backgroundImage: `url('${
//             process.env.NEXT_PUBLIC_MEDIA_PATH +
//             mainpage.sections[0].section[0].data.image
//           }')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="container">
//         <div className="breadcumb-content">
//           <h1 className="breadcumb-title">{mainpage.sections[0].section[1].data.Text}</h1>
//           <ul className="breadcumb-menu">
//             <li>
//               <Link href="/">Home</Link>
//             </li>
//             <li>{mainpage.sections[0].section[1].data.Text}</li>
//           </ul>
//         </div>
//       </div>
//     </div>





//     <div className="space">
//       <div className="container">
//         {/* Title Area */}
//         <div className="title-area text-center">
//           <span className="sub-title">Get In Touch</span>
//           <h2 className="sec-title">Our Contact Information</h2>
//         </div>

//         {/* Contact Info Grid */}
//         <div className="row gy-4 justify-content-center">
//           {/* Address */}
//           <div className="col-xl-4 col-lg-6">
//             <div className="about-contact-grid style2">
//               <div className="about-contact-icon">
//                 <Image
//                   src="/img/icon/location-dot2.svg"
//                   alt="Address Icon"
//                   width={32}
//                   height={32}
//                 />
//               </div>
//               <div className="about-contact-details">
//                 <h6 className="box-title">Our Address</h6>
//                 <p className="about-contact-details-text">
//                   {mainpage.sections[1].section[0].data.Text}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Phone Numbers */}
//           <div className="col-xl-4 col-lg-6">
//             <div className="about-contact-grid">
//               <div className="about-contact-icon">
//                 <Image
//                   src="/img/icon/call.svg"
//                   alt="Phone Icon"
//                   width={32}
//                   height={32}
//                 />
//               </div>
//               <div className="about-contact-details">
//                 <h6 className="box-title">Phone Number</h6>
//                 <p className="about-contact-details-text">
//                   <Link href={mainpage.sections[1].section[1].data.button_link}>{mainpage.sections[1].section[1].data.button_label}</Link>
//                 </p>
//                 <p className="about-contact-details-text">
//                   <Link href={mainpage.sections[1].section[2].data.button_link}>{mainpage.sections[1].section[2].data.button_label}</Link>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Email */}
//           <div className="col-xl-4 col-lg-6">
//             <div className="about-contact-grid">
//               <div className="about-contact-icon">
//                 <Image
//                   src="/img/icon/mail.svg"
//                   alt="Email Icon"
//                   width={32}
//                   height={32}
//                 />
//               </div>
//               <div className="about-contact-details">
//                 <h6 className="box-title">Email Address</h6>
//                 <p className="about-contact-details-text">
//                   <Link href={mainpage.sections[1].section[3].data.button_link}>{mainpage.sections[1].section[3].data.button_label}</Link>
//                 </p>
//                 <p className="about-contact-details-text">
//                   <Link href={mainpage.sections[1].section[4].data.button_link}>{mainpage.sections[1].section[4].data.button_label}</Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//         <ContactUsForm heading={mainpage.sections[1].section[5].data.Text} banner={mainpage.sections[1].section[6].data.image} video={mainpage.sections[1].section[7].data.url} />
//         <div className="">
//             <iframe src={mainpage.sections[1].section[8].data.url} width="100%" height="450" allowFullScreen ="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
//         </div>
//     </>
//   )
// }


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import Image from "next/image";
import ContactUsForm from "@/components/Contact/ContactUsForm";
import Link from "next/link";
import { getPagewithSection } from "@/services/pageSection";

const replaceOldPhone = (value = "") =>
  String(value).replace(/9876543210/g, "9679945077");

const normalizePhoneData = (phone = {}) => ({
  ...phone,
  button_label: replaceOldPhone(phone.button_label),
  button_link: replaceOldPhone(phone.button_link),
});

export async function generateMetadata({ params }) {
  try {
    const mainpage = await getPagewithSection(5);
    const { slug } = await params;
    return {
      title: mainpage?.meta_title || "Contact Us",
      description: mainpage?.meta_description || "Contact Tour Pickkars",
      keywords: mainpage?.meta_description || "",
      alternates: {
        canonical: `/contact`,
      },
      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
        title: mainpage?.meta_title || "Contact Us",
        description: mainpage?.meta_description || "Contact Tour Pickkars",
        keywords: mainpage?.meta_description || "",
      },
      twitter: {
        card: "summary_large_image",
        title: mainpage?.meta_title || "Contact Us",
        description: mainpage?.meta_description || "Contact Tour Pickkars",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Contact Us",
      description: "Contact Tour Pickkars",
    };
  }
}

export default async function Contact() {
  let mainpage;

  try {
    mainpage = await getPagewithSection(5);
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    // Return fallback UI if API fails
    return (
      <div className="space">
        <div className="container">
          <div className="title-area text-center">
            <span className="sub-title">Get In Touch</span>
            <h2 className="sec-title">Our Contact Information</h2>
            <p className="text-danger mt-3">
              Unable to load contact information. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Safe access to data with fallbacks
  const breadcrumbImage = mainpage?.sections?.[0]?.section?.[0]?.data?.image
    ? `${process.env.NEXT_PUBLIC_MEDIA_PATH}${mainpage.sections[0].section[0].data.image}`
    : '/img/bg/breadcumb-bg.jpg';

  const breadcrumbTitle = mainpage?.sections?.[0]?.section?.[1]?.data?.Text || "Contact Us";

  const address = mainpage?.sections?.[1]?.section?.[0]?.data?.Text || "Your address here";
  const phone1 = normalizePhoneData(mainpage?.sections?.[1]?.section?.[1]?.data || {});
  const phone2 = normalizePhoneData(mainpage?.sections?.[1]?.section?.[2]?.data || {});
  const email1 = mainpage?.sections?.[1]?.section?.[3]?.data || {};
  const email2 = mainpage?.sections?.[1]?.section?.[4]?.data || {};
  const formHeading = mainpage?.sections?.[1]?.section?.[5]?.data?.Text || "Send Message";
  const formBanner = mainpage?.sections?.[1]?.section?.[6]?.data?.image || "";
  const formVideo = mainpage?.sections?.[1]?.section?.[7]?.data?.url || "";
  const mapUrl = mainpage?.sections?.[1]?.section?.[8]?.data?.url || "";

  return (
    <>
      <div
        className="breadcumb-wrapper rounded-bottom-5"
        style={{
          backgroundImage: `url('${breadcrumbImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div className="absolute inset-0 bg-dark opacity-50"></div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="breadcumb-content text-center">
            <span className="badge bg-theme-soft text-theme rounded-pill px-4 py-2 mb-3 fw-bold sliding-text" style={{ letterSpacing: '2px', position: 'inherit' }}>GET IN TOUCH</span>
            <h1 className="breadcumb-title text-white fw-800 display-3 mb-4">{breadcrumbTitle}</h1>
            <ul className="breadcumb-menu justify-content-center d-flex gap-3 list-unstyled">
              <li>
                <Link href="/" className="text-white opacity-75 text-decoration-none">Home</Link>
              </li>
              <li className="text-white">{breadcrumbTitle}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space mt-n5 position-relative" style={{ zIndex: 10 }}>
        <div className="container">
          <div className="row gy-4 justify-content-center">
            {/* Address */}
            <div className="col-xl-4 col-lg-6">
              <div className="contact-info-card">
                <div className="contact-icon-wrapper">📍</div>
                <h4 className="fw-bold mb-3">Our Office</h4>
                <p className="text-muted lh-lg mb-0">{address}</p>
                <div className="mt-4 pt-3 border-top border-light">
                  <Link
                    href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                    target="_blank"
                    className="btn-link text-theme fw-bold text-decoration-none"
                  >
                    View on Maps →
                  </Link>
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="col-xl-4 col-lg-6">
              <div className="contact-info-card">
                <div className="contact-icon-wrapper">📞</div>
                <h4 className="fw-bold mb-3">Call Support</h4>
                <Link href={phone1.button_link || "tel:"} className="contact-details-link fs-5">{phone1.button_label || "No Phone Found"}</Link>
                <Link href={phone2.button_link || "tel:"} className="contact-details-link fs-5">{phone2.button_label || ""}</Link>
                <div className="mt-4 pt-3 border-top border-light">
                  <span className="small text-muted">Mon - Sat (10am - 8pm)</span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="col-xl-4 col-lg-6">
              <div className="contact-info-card">
                <div className="contact-icon-wrapper">✉️</div>
                <h4 className="fw-bold mb-3">Email Us</h4>
                <Link href={email1.button_link || "mailto:"} className="contact-details-link fs-5">{email1.button_label || "No Email Found"}</Link>
                <Link href={email2.button_link || "mailto:"} className="contact-details-link fs-5">{email2.button_label || ""}</Link>
                <div className="mt-4 pt-3 border-top border-light">
                  <span className="small text-muted">Response within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-smoke my-5">
        <ContactUsForm
          heading={formHeading}
          banner={formBanner}
          video={formVideo}
        />
      </div>

      {mapUrl && (
        <div className="container space-bottom">
          <div className="map-card-premium">
            <iframe
              src={mapUrl}
              width="100%"
              height="550"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              style={{ border: 0 }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
