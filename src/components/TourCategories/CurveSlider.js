"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { CategoriesCard } from "./CategoriesCard";
import { homeTrips } from "@/services/tripsApi";

const CurveSlider = ({ trips }) => {

  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.update();
      }
    }, 500);

    return () => clearTimeout(handle);
  }, [loading]);

  const multiplier = { translate: 0.12, rotate: 0.005 };

  useEffect(() => {
    const calculateWheel = () => {
      const slides = document.querySelectorAll(".single");
      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
        let ty =
          Math.abs(r) * multiplier.translate -
          rect.width * multiplier.translate;
        if (ty < 0) ty = 0;
        const transformOrigin = r < 0 ? "left top" : "right top";
        slide.style.transform = `translateY(${ty}px) rotate(${-r * multiplier.rotate
          }deg)`;
        slide.style.transformOrigin = transformOrigin;
      });
    };

    let frameId;
    const raf = () => {
      frameId = requestAnimationFrame(raf);
      calculateWheel();
    };
    raf();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className="swiper th-slider has-shadow categorySlider"
      id="categorySlider1"
      style={{
        backgroundImage: "url('/img/bg/category_bg_1.png')",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)} // store swiper instance
        slidesPerView={5}
        loop={true}
        grabCursor={true}
        simulateTouch={true}
        draggable={true}
        spaceBetween={30}
        touchRatio={1.2}
        speed={1000}
        modules={[Autoplay, Pagination, Navigation]}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".slider-pagination" }}
        breakpoints={{
          0: { slidesPerView: 1.1 },
          576: { slidesPerView: 1.1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 3 },
          1400: { slidesPerView: 5 },
        }}
      >
        {trips.map((item, index) => (
          <SwiperSlide key={index}>
            <CategoriesCard image={item.thumbnail} title={item.heading} slug={item.slug} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="slider-pagination"></div>
    </div>
  );
};

export default CurveSlider;
