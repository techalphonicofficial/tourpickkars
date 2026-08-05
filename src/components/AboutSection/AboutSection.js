"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getPagewithSection } from "@/services/pageSection";
import { sanitizeCmsHtml } from "@/functions/sanitizeCmsHtml";
import "./AboutSection.css";

const mainpage = await getPagewithSection(1, "trip_with_us");

export default function AboutSection() {
  return (
    <section className="about-area position-relative overflow-hidden" id="about-sec">
      <div className="container position-relative">
        <div className="row align-items-center">

          {/* ── LEFT: Image Mosaic ── */}
          <div className="col-xl-6 col-lg-6">
            <div className="about-img-mosaic">

              {/* Main image */}
              <div className="about-img-main">
                <Image
                  src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.section[0].data.image}
                  alt="Adventure"
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>

              {/* Accent image */}
              <div className="about-img-accent">
                <Image
                  src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.section[1].data.image}
                  alt="Experience"
                  fill
                  sizes="(max-width:768px) 100vw, 30vw"
                />
              </div>

              {/* Avatar */}
              <div className="about-img-avatar">
                <Image
                  src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage.section[2].data.image}
                  alt="Traveler"
                  fill
                  sizes="120px"
                />
              </div>

              {/* Floating Experience Badge */}
              <div className="about-exp-badge">
                <span className="exp-number">10+</span>
                <span className="exp-label">Years of Experience</span>
              </div>

              {/* Floating Reviews Pill */}
              <div className="about-reviews-pill">
                <div className="review-avatars">
                  <span>AK</span>
                  <span>SR</span>
                  <span>MR</span>
                </div>
                <div className="review-text">
                  <strong>4700+ Happy Travelers</strong>
                  <small>Join our growing community</small>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div className="col-xl-6 col-lg-6">
            <div className="about-content">

              {/* Eyebrow */}
              <span className="about-eyebrow">
                {mainpage.section[3].data.Text}
              </span>

              {/* Heading */}
              <h2 className="about-heading">
                {mainpage.section[4].data.Text
                  .replace(/tourpickkars/g, "Tour Pickkars")
                  .replace(/Enlive/g, "Tour Pickkars")
                  .split(" ")
                  .map((word, i, arr) =>
                    i >= arr.length - 2
                      ? <span key={i}>{word} </span>
                      : word + " "
                  )}
              </h2>

              {/* Description */}
              <div
                className="about-desc"
                dangerouslySetInnerHTML={{
                  __html: sanitizeCmsHtml(
                    mainpage.section[5].data.rich_text
                      .replace(/tourpickkars/g, "Tour Pickkars")
                      .replace(/Enlive/g, "Tour Pickkars")
                  ),
                }}
              />

              {/* Stats Strip */}
              <div className="about-stats-strip">
                <div className="about-stat-item">
                  <span className="stat-num">500+</span>
                  <span className="stat-lbl">Trips Done</span>
                </div>
                <div className="about-stat-divider" />
                <div className="about-stat-item">
                  <span className="stat-num">4700+</span>
                  <span className="stat-lbl">Happy Travelers</span>
                </div>
                <div className="about-stat-divider" />
                <div className="about-stat-item">
                  <span className="stat-num">10+</span>
                  <span className="stat-lbl">Destinations</span>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="about-features-grid">
                {mainpage.section.slice(6, 8).map((item, index) => (
                  <div className="about-feature-card" key={index}>
                    <div className="about-feature-icon">
                      <Image
                        src={process.env.NEXT_PUBLIC_MEDIA_PATH + item.data.section[0].data.image}
                        alt={item.data.section[1].data.Text}
                        width={28}
                        height={28}
                      />
                    </div>
                    <div>
                      <div className="about-feature-title h5">{item.data.section[1].data.Text}</div>
                      <p className="about-feature-text">{item.data.section[2].data.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Row */}
              <div className="about-cta-row">
                <Link href="/contact" className="th-btn py-4 px-3">
                  Contact With Us
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <div className="about-rating-chip">
                  <span className="stars">★★★★★</span>
                  <div className="rating-info">
                    <strong>4.9 / 5</strong>
                    <small>Average Rating</small>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
