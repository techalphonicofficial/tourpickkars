"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { getPagewithSection } from "@/services/pageSection";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./TestimonialSection.css";

const mainpage = await getPagewithSection(1, "testimonials");

export default function TestimonialSection() {
  const testimonials = mainpage.section[2].data.testimonials_items;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    return Array.from({ length: 5 }).map((_, i) => {
      if (i < fullStars)
        return <FontAwesomeIcon key={i} icon={faSolidStar} style={{ color: "#fbbf24" }} />;
      if (i === fullStars && hasHalf)
        return <FontAwesomeIcon key={i} icon={faStarHalfStroke} style={{ color: "#fbbf24" }} />;
      return <FontAwesomeIcon key={i} icon={faRegularStar} style={{ color: "#fbbf24", opacity: 0.4 }} />;
    });
  };

  return (
    <section className="testi-area overflow-hidden" id="testi-sec">
      <div className="container">

        {/* ── Header ── */}
        <div className="testi-header">
          <div className="testi-eyebrow">
            {mainpage.section[0].data.Text}
          </div>
          <h2 className="testi-heading">
            {mainpage.section[1].data.Text}
          </h2>
        </div>

        {/* ── Slider ── */}
        <div className="testi-slider-wrap">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 3000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            speed={800}
            pagination={{ clickable: true, el: ".testi-pagination" }}
            spaceBetween={24}
            centeredSlides={true}
            breakpoints={{
              0:    { slidesPerView: 1 },
              640:  { slidesPerView: 1.2, centeredSlides: true },
              768:  { slidesPerView: 2, centeredSlides: true },
              1024: { slidesPerView: 2.2, centeredSlides: true },
              1280: { slidesPerView: 3, centeredSlides: true },
            }}
            className="testiSlider1"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="testi-card">
                  {/* Big decorative quote */}
                  <div className="testi-quote-mark">"</div>

                  {/* Stars */}
                  <div className="testi-stars">
                    {renderStars(item.rating)}
                  </div>

                  {/* Scrollable review text — fixed 6-line height */}
                  <div className="testi-text-wrap">
                    <p className="testi-text">{item.content}</p>
                  </div>

                  {/* Profile */}
                  <div className="testi-profile">
                    <div className="testi-avatar">
                      <Image
                        src={process.env.NEXT_PUBLIC_MEDIA_PATH + item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                      />
                    </div>
                    <div className="testi-profile-info">
                      <h3 className="testi-name">{item.name}</h3>
                      <span className="testi-role">{item.type}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom pagination */}
          <div className="testi-pagination" />
        </div>

      </div>
    </section>
  );
}
