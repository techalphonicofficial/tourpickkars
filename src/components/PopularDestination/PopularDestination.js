"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopularCard from "./PopularCard";
import { getPagewithSection } from "@/services/pageSection";
import { getHomeDestination } from "@/services/destinationApi";

const mainpage = await getPagewithSection(1, "destination");
const homeDestination = await getHomeDestination();

// console.log("homeDestination", homeDestination);


export default function PopularDestination() {
  return (
    <div className="position-relative overflow-hidden pt-8 mt-60 mb-35">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">{mainpage.section[0].data.Text}</span>
          <h2 className="sec-title">{mainpage.section[1].data.Text}</h2>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 2500 }}
          speed={1000}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 0,
            stretch: 95,
            depth: 212,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[Autoplay, EffectCoverflow, Navigation]}
          navigation={true}
          breakpoints={{
            0: { slidesPerView: 1.1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 3 },
          }}
          className="th-slider destination-slider slider-drag-wrap"
        >
          {homeDestination.map((item) => (
            <SwiperSlide key={item.id}>
              <PopularCard
                image={item.thumbnail}
                title={item.name}
                subtitle={item.active_packages_count}
                slug={item.slug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}