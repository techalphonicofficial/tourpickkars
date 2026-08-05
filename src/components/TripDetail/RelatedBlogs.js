"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "@/components/BlogSection/BlogSection.css"; // inherit new blog styling
import { getBlogsByTripDestination } from "@/services/blogApi";
import { createSlug } from "@/functions/createSlug";

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function RelatedBlogs({ title, destination, trip }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!trip || !destination) return;

      try {
        const data = await getBlogsByTripDestination(
          trip + " " + destination + " " + title
        );
        setBlogs(data || []);
      } catch (err) {
        console.log("Error fetching blogs:", err.message);
      }
    };

    fetchBlogs();
  }, [trip, destination, title]);

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="blog-section position-relative overflow-hidden mb-5" id="blog-sec" style={{ backgroundColor: "transparent", padding: "40px 0" }}>
      <div className="container">

        {/* ── Header ── */}
        <div className="blog-section-header">
          <div className="blog-header-left">
            <div className="blog-eyebrow">Related Articles</div>
            <div className="h3">
              Articles From <span>{destination || "this trip"}</span>
            </div>
          </div>
          <Link href="/blog" className="blog-see-all-btn">
            See All Articles <ArrowIcon />
          </Link>
        </div>

        {/* ── Slider ── */}
        <div className="blog-slider-wrap">
          <Swiper
            modules={[Autoplay]}
            loop={blogs.length > 3}
            autoplay={{
              delay: 3500,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            speed={800}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="blog-swiper"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <div className="blog-card" style={{ height: "100%" }}>
                  {/* Image */}
                  <div className="blog-card-img" style={{ minHeight: "220px" }}>
                    <Image
                      src={blog.image}
                      alt={blog.heading}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    {/* Category badge */}
                    <span className="blog-cat-badge">Travel</span>
                    {/* Date badge */}
                    <span className="blog-date-badge">
                      <CalendarIcon />
                      {blog.created_at}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="blog-card-body d-flex flex-column" style={{ flexGrow: 1 }}>
                    <div className="blog-card-title mb-3 h3">
                      <Link href={`/blog/${blog.slug}`}>{blog.heading}</Link>
                    </div>

                    {blog.excerpt && (
                      <p className="blog-card-excerpt flex-grow-1" style={{ marginBottom: "1.5rem" }}>
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="blog-card-footer mt-auto">
                      <div className="blog-author-chip">
                        <div className="blog-author-avatar">TP</div>
                        Tour Pickkars
                      </div>
                      <Link href={`/blog/${blog.slug}`} className="blog-read-link">
                        Read More <ArrowIcon />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
