"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Instavideo({ related_insta_video }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const getInstagramEmbedUrl = (url) => {
    if (!url) return "";

    const cleanUrl = url.split("?")[0];

    if (cleanUrl.includes("/embed")) {
      return `${cleanUrl}?autoplay=1`;
    }

    return `${cleanUrl}embed/?autoplay=1`;
  };

  return (
    <div
      className="sidebar-gallery-area bg-smoke space pt-0 mb-60  position-relative"
      style={{
        backgroundImage: "url(/img/bg/shape_bg_1.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container th-container">
        <div className="title-area text-center pt-5">
          <span className="sub-title">Travelers On Instagram</span>
          <div className="h3">
            <i>
              <FontAwesomeIcon icon={faInstagram} />
            </i>{" "}
            Travel Reels
          </div>
          <div className="h5 h3">Reviews that make me Blush</div>
          <p className='text-center smp'>Testimonials, Reviews, Experiences, Virtual Tours & Much More</p>
        </div>

        <div className="slider-area">
          <Swiper
            loop={true}
            touchRatio={1.2}
            speed={1000}
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
              1400: { slidesPerView: 6 },
            }}
            className="has-shadow"
          >
            {related_insta_video.map((video, index) => (
              <SwiperSlide key={index}>
                <div className="gallery-thumb2">
                  <img
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + video.thumbnail}
                    alt={`Instagram Video ${index + 1}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedVideo(getInstagramEmbedUrl(video.video_url))}
                  />
                  <i
                    className="gallery-btn"
                    role="button"
                    onClick={() => setSelectedVideo(getInstagramEmbedUrl(video.video_url))}
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </i>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Popup Modal */}
        {selectedVideo && (
          <div id="login-form" className="popup-login-register mfp-hide" onClick={() => setSelectedVideo(null)} >
            <div className=" bg-white rounded-xl overflow-hidden max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <button className="closeButton border-0" onClick={() => setSelectedVideo(null)} >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <iframe
                src={selectedVideo}
                width="100%"
                height="650"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture;"
                allowFullScreen
                muted
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
