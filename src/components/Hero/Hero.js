"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper as SwiperType } from "swiper"; // ✅ correct type import
import "swiper/swiper-bundle.css";
import "./Hero.css";

import { TypeAnimation } from "react-type-animation";
import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getPagewithSection } from "@/services/pageSection";
import { api } from "@/services/config";
import { createSlug } from "@/functions/createSlug";

export default function Hero({ mainpage }) {
  const arr = mainpage.section[2].data.content.split("|");
  const [results, setResults] = useState([]);
  // console.log("mainpage", mainpage)
  let newArr = arr.reduce((acc, item, index) => {
    acc.push(item);
    acc.push(1000); // index ke hisaab se nayi value
    return acc;
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Update debouncedTerm after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // 500ms delay after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      const fetchData = async () => {
        try {
          const response = await api.get(`/packages/search/${debouncedTerm}`);
          setResults(response.data);
        } catch (error) {
          console.error("API error:", error);
        }
      };

      fetchData();
    }
  }, [debouncedTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  return (
    <>
      <div className="position-relative w-100 z-2 hero-section-Home" style={{ height: "90vh" }}>
        {/* Swiper */}
        <Swiper
          // modules={[Autoplay, EffectFade]}
          // autoplay={{ delay: 5000, disableOnInteraction: false }}
          // speed={1000}
          // effect="fade"
          // loop={true}
          // onSwiper={(swiper) => {
          //   swiperRef.current = swiper;   // ✅ works fine now
          // }}
          // slidesPerView={1}
          className="h-100"
        >
          <SwiperSlide className="position-relative">
            <video
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
              src={
                process.env.NEXT_PUBLIC_MEDIA_PATH +
                mainpage.section[6].data.video
              }
              autoPlay
              muted
              playsInline
            />
          </SwiperSlide>
        </Swiper>
        {/* <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        effect="fade"
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;   // ✅ works fine now
        }}
        slidesPerView={1}
        className="h-100"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="position-relative">
            {slide.type === "video" ? (
              <video
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                src={slide.src}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
              />
            ) : (
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper> */}

        {/* Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 z-1"></div>

        {/* Hero Content */}
        <div className="hero-content-wrapper container">
          <div className="hero-main-content">
            <span className="hero-subtitle mb-3 d-inline-block">
              {mainpage.section[0].data.Text}
            </span>
            <h1 className="hero-title display-3 fw-bold mb-3 mt-0">
              {mainpage.section[1].data.Text.replace(/Enlive/g, "Tour Pickkars")}
            </h1>

            {/* Typing Animation */}
            <div className="hero-typing-animation mb-2">
              <TypeAnimation
                sequence={newArr}
                wrapper="span"
                speed={50}
                className="typing-text"
                repeat={Infinity}
              />
            </div>

            {/* Professional Search Bar */}
            <div className="hero-search-container mx-auto">
              <div className="search-input-group">
                <div className="search-icon-left">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <input
                  type="text"
                  className="form-control hero-input"
                  placeholder="Where do you want to go?"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="btn hero-search-btn">
                  Search
                </button>
              </div>

              {searchTerm && results.length > 0 && (
                <div className="search-results-dropdown shadow-lg">
                  {results.map((item, index) => (
                    <Link
                      key={index}
                      href={`/${createSlug(item.slug)}`}
                      className="search-result-item"
                    >
                      <div className="result-info">
                        <span className="result-title">{item.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Professional Stats Row */}
          <div className="hero-stats-row row g-4 mt-3 pb-4">
            {mainpage.section.slice(3, 6).map((item, index) => (
              <div className="col-md-4 col-4" key={index}>
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_MEDIA_PATH +
                        item.data.section[0].data.image
                      }
                      alt={item.data.section[2].data.Text}
                      height={40}
                      width={40}
                    />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">
                      <CountUp
                        end={Number(item.data.section[1].data.Text)}
                        duration={3}
                      />
                      +
                    </h3>
                    <p className="stat-label">{item.data.section[2].data.Text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-stats-row-mob row g-4 mt-3 pb-4">
          {mainpage.section.slice(3, 6).map((item, index) => (
            <div className="col-md-4 col-4" key={index}>
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_MEDIA_PATH +
                      item.data.section[0].data.image
                    }
                    alt={item.data.section[2].data.Text}
                    height={40}
                    width={40}
                  />
                </div>
                <div className="stat-info">
                  <h3 className="stat-number">
                    <CountUp
                      end={Number(item.data.section[1].data.Text)}
                      duration={3}
                    />
                    +
                  </h3>
                  <p className="stat-label">{item.data.section[2].data.Text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
