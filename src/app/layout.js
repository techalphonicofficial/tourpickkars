// import { Geist, Geist_Mono } from "next/font/google";
// import { Geist, Geist_Mono } from "next/font/google";
import { Montez, Manrope } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import 'swiper/css';

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Disable auto CSS injection
config.autoAddCss = false;

import Header from "@/components/Partials/Header";
import Footer from "@/components/Partials/Footer";
import { getPagewithSection } from "@/services/pageSection";
import { tripsWithPackagecount } from "@/services/tripsApi";
import Script from "next/script";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// ✅ Montez font
const montez = Montez({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-montez",
});

// ✅ Manrope font
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const GTM_ID = "G-C2265Q1FBH";
//ssfasf
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";



export const viewport = {
  themeColor: "#00c18d",
};

export const metadata = {
  metadataBase: new URL("https://www.tourpickkars.in"),

  title: "Tour Pickkars",
  description: "Tour Pickkars - Book your tours and travel experiences with us.",
  authors: [{ name: "Tour Pickkars" }],
  keywords: [
    "Travel",
    "Tour Booking",
    "Tour Pickkars",
    "Travel Agency",
    "Holiday Booking"
  ],
  robots: "index, follow",

  // 🔹 Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: "Tour Pickkars",
    description: "Book your tours and travel experiences with Tour Pickkars.",
    url: "https://www.tourpickkars.in",// replace with your actual domain
    siteName: "Tour Pickkars",
    images: [
      {
        
        url: "/img/logo.webp", // put og-image.jpg in /public/assets/img/
        width: 1200,
        height: 630,
        alt: "Tour Pickkars",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 🔹 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Tour Pickkars",
    description: "Plan your dream vacation with Tour Pickkars, your trusted travel partner.",
    creator: "@tourpickkars",
    images: ["/img/logo.webp"],
  },

  // 🔹 Favicons
  icons: {
    icon: [
      { url: "/img/logo.webp", sizes: "32x32" },
      { url: "/img/logo.webp", sizes: "96x96" },
      { url: "/img/logo.webp", sizes: "16x16" },
    ],
    apple: [
      { url: "/img/logo.webp", sizes: "57x57" },
      { url: "/img/logo.webp", sizes: "60x60" },
      { url: "/img/logo.webp", sizes: "72x72" },
      { url: "/img/favicon.webp", sizes: "76x76" },
      { url: "/img/favicon.webp", sizes: "114x114" },
      { url: "/img/favicon.webp", sizes: "120x120" },
      { url: "/img/favicon.webp", sizes: "144x144" },
      { url: "/img/favicon.webp", sizes: "152x152" },
      { url: "/img/favicon.webp", sizes: "180x180" },
    ],
    other: [
      { rel: "msapplication-TileImage", url: "/img/favicon.webp" },
    ],
  },
};

export default async function RootLayout({ children }) {
  const [mainpage, tripsWithcount, footerData] = await Promise.all([
    getPagewithSection(6),
    tripsWithPackagecount(),
    getPagewithSection(6, "footer"),
  ]);

  return (
    <html lang="en">
      <body className={`${montez.variable} ${manrope.variable}`}>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header mainpage={mainpage} tripsWithcount={tripsWithcount} />
        {children}
        <Footer footer={footerData} />
      </body>
    </html>
  );
}
