"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { getPagewithSection } from "@/services/pageSection";
import { getBlogs } from "@/services/blogApi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./BlogSection.css";

const mainpage = await getPagewithSection(1, "blogs");
const blogPosts = await getBlogs();

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

export default function BlogSection() {
  const titleWords = mainpage.section[1].data.Text.split(" ");

  return (
    <section className="blog-section" id="blog-sec">
      <div className="container">

        {/* ── Header ── */}
        <div className="blog-section-header">
          <div className="blog-header-left">
            <div className="blog-eyebrow">{mainpage.section[0].data.Text}</div>
            <h2 className="blog-section-title">
              {titleWords.slice(0, -2).join(" ")}{" "}
              <span>{titleWords.slice(-2).join(" ")}</span>
            </h2>
          </div>
          <Link href="blog" className="blog-see-all-btn">
            See All Articles <ArrowIcon />
          </Link>
        </div>

        {/* ── Slider ── */}
        <div className="blog-slider-wrap">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={true}
            loop={true}
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
            {blogPosts.data.map((blog) => (
              <SwiperSlide key={blog.id}>
                <div className="blog-card">

                  {/* Image */}
                  <div className="blog-card-img">
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
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">
                      <Link href={`blog/${blog.slug}`}>{blog.heading}</Link>
                    </h3>

                    {blog.excerpt && (
                      <p className="blog-card-excerpt">{blog.excerpt}</p>
                    )}

                    <div className="blog-card-footer">
                      <div className="blog-author-chip">
                        <div className="blog-author-avatar">TP</div>
                        Tour Pickkars
                      </div>
                      <Link href={`blog/${blog.slug}`} className="blog-read-link">
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
