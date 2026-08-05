"use client";
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./VideosSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { apiEndpoint } from "@/services/config";

const HoverVideoPlayer = ({ videoSrc, thumbnailSrc, tag }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        if (isHovered && videoRef.current) {
            videoRef.current.play().catch((e) => {
                if (isMounted) console.log("Video play failed:", e);
            });
        } else if (!isHovered && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        return () => { isMounted = false; };
    }, [isHovered]);

    return (
        <>
            <div
                className={`gallery-thumb2 custom-video-thumb w-100 ${isHovered ? 'is-hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Thumbnail Image */}
                <img
                    src={thumbnailSrc}
                    alt="Video Thumbnail"
                    className="video-thumb-img"
                    style={{ opacity: isHovered ? 0 : 1 }}
                />

                {/* Video Element */}
                <video
                    ref={videoRef}
                    src={videoSrc}
                    loop
                    muted={isMuted}
                    playsInline
                    className="video-thumb-video"
                    style={{ opacity: isHovered ? 1 : 0 }}
                />

                {/* Volume Toggle Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsMuted(!isMuted);
                    }}
                    className="vol-btn"
                    style={{ opacity: isHovered ? 1 : 0 }}
                >
                    <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} size="sm" />
                </button>

                <div
                    className="insta-icon-overlay"
                    style={{ opacity: isHovered ? 0 : 1 }}
                >
                    <FontAwesomeIcon icon={faPlayCircle} />
                </div>
            </div>
            <div className="video-list-title mt-2 px-2 d-flex align-items-center gap-2">
                <div className="icon">
                    <img src="/img/favicon.webp" alt="" aria-hidden="true" width={32} height={32} />
                </div>
                <div className="title">
                    <div className="h3">{tag}</div>
                </div>
            </div>
        </>
    );
};

export default function VideosSection() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch(apiEndpoint("/banner-videos"))
            .then((res) => res.json())
            .then((res) => {
                if (res.status && res.data) {
                    setVideos(res.data);
                }
            })
            .catch((err) => console.log("Failed to fetch videos:", err));
    }, []);
    // console.log("videoSrc", videos)

    return (
        <div
            className="sidebar-gallery-area bg-smoke space pt-0  position-relative"
            style={{
                backgroundImage: "url(/img/bg/shape_bg_1.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="container th-container">
                <div className="title-area text-center pt-5">
                    <span className="sub-title">Real Experiences</span>
                    <div className="sec-title h2">
                        <i>
                            <FontAwesomeIcon icon={faPlayCircle} />
                        </i>{" "}
                        Video Reviews
                    </div>
                    <div className="h5 h3">Reviews that make me Blush</div>
                    <p className="text-center smp">Testimonials, Reviews, Experiences, Virtual Tours & Much More</p>
                </div>

                <div className="slider-area mt-4">
                    <Swiper
                        loop={true}
                        touchRatio={1.2}
                        speed={1000}
                        modules={[Autoplay, Pagination, Navigation]}
                        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        spaceBetween={20}
                        navigation={true}
                        breakpoints={{
                            0: { slidesPerView: 1.1 },
                            576: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 },
                            1400: { slidesPerView: 6 },
                        }}
                        className="has-shadow videos-swiper"
                        style={{ paddingBottom: "30px", paddingTop: "10px" }}
                    >
                        {videos.map((video, index) => (
                            <SwiperSlide key={video.id || index}>
                                <HoverVideoPlayer
                                    thumbnailSrc={video.banner}
                                    videoSrc={video.video}
                                    tag={video.tage}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
