"use client";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function RelatedYoutube({ related_youtube_video }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    // -------- YOUTUBE --------
    if (url.includes("youtu")) {
      let videoId = "";

      // Shorts URL
      if (url.includes("/shorts/")) {
        videoId = url.split("/shorts/")[1].split("?")[0];
      }

      // youtu.be URL
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }

      // youtube.com/watch?v=
      else if (url.includes("watch")) {
        videoId = new URL(url).searchParams.get("v");
      }

      if (!videoId) return "";

      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // -------- INSTAGRAM --------
    if (url.includes("instagram.com")) {
      const cleanUrl = url.split("?")[0];

      if (cleanUrl.includes("/embed")) {
        return `${cleanUrl}?autoplay=1`;
      }

      return `${cleanUrl}embed/?autoplay=1`;
    }

    return url;
  };

  // console.log(selectedVideo)
  return (
    <div
      className="sidebar-gallery-area bg-smoke space position-relative"
      style={{
        backgroundImage: "url(/img/bg/shape_bg_1.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container th-container">
        <div className="title-area text-center">
          <span className="sub-title">Travelers On Youtube</span>
          <div className="h3">
            <i>
              <FontAwesomeIcon icon={faYoutube} />
            </i>{" "}
            Captured Journeys
          </div>
          <div className="h5 h3">Reviews that make me Blush</div>
          <p className="text-center smp">
            Testimonials, Reviews, Experiences, Virtual Tours & Much More
          </p>
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
            {related_youtube_video.map((video, index) => (
              <SwiperSlide key={index}>
                <div className="gallery-thumb2">
                  <img
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + video.thumbnail}
                    alt={`YouTube Video ${index + 1}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedVideo(getYoutubeEmbedUrl(video.video_url))}
                  />
                  <i
                    className="gallery-btn"
                    role="button"
                    onClick={() => setSelectedVideo(getYoutubeEmbedUrl(video.video_url))}
                  >
                    <FontAwesomeIcon icon={faYoutube} />
                  </i>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {selectedVideo && (
          <div
            id="login-form"
            className="popup-login-register mfp-hide"
            style={{ maxWidth: "600px" }}
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className=" bg-white rounded-xl overflow-hidden max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="closeButton border-0"
                onClick={() => setSelectedVideo(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <iframe
                src={selectedVideo}
                width="100%"
                height="450"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
