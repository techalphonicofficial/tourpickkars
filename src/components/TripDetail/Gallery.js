"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function Gallery({gallery}) {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setThumbsSwiper(null); // 🔑 Reset to avoid destroyed swiper errors
  };

  // 🔒 Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h3>Gallery</h3>
      </div>
      <div className="container my-5">
        <div className="row g-2">
          {/* Large Left Image */}
          <div className="col-md-6">
            <div
              className="h-100 position-relative"
              style={{ cursor: "pointer", borderRadius: "12px", overflow: "hidden" }}
              onClick={() => openModal(0)}
            >
              <img
                src={gallery[0]}
                className="w-100 h-100 img-fluid"
                style={{ objectFit: "cover" }}
                alt="Gallery preview"
              />
            </div>
          </div>

          {/* Right Grid 2x2 */}
          <div className="col-md-6 d-grid gap-2">
            <div className="row g-2">
              {gallery.slice(1, 5).reverse().map((img, index) => (
                <div className="col-6" key={index + 1}>
                  <div
                    className="position-relative h-100"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      index === 3
                        ? openModal(0) // open gallery if last tile
                        : openModal(index + 1)
                    }
                  >
                    <img
                      src={img}
                      className="w-100 h-100 img-fluid"
                      style={{ objectFit: "cover" }}
                      alt={`Gallery thumbnail ${index + 1}`}
                    />

                    {/* Overlay for last image */}
                    {index === 3 && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                        <span className="text-white fw-bold fs-5">+{gallery.length} Photos</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal with Gallery Slider */}
        {showModal && mounted && createPortal(
          <div className="bg-dark d-flex flex-column align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999999 }}>
            {/* Close Button */}
            <button
              className="btn btn-light position-absolute top-0 end-0 m-4 rounded-circle d-flex align-items-center justify-content-center shadow-lg"
              onClick={closeModal}
              style={{ width: "44px", height: "44px", zIndex: 1000 }}
            >
              <FontAwesomeIcon icon={faClose} className="fs-5" />
            </button>

            {/* Main Slider */}
            <div style={{ width: "90%", height: "75%", position: 'relative' }}>
              <Swiper
                modules={[Navigation, Pagination, Thumbs, Keyboard]}
                navigation
                keyboard={{ enabled: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                initialSlide={currentIndex}
                className="h-100"
              >
                {gallery.slice().reverse().map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <img
                        src={img}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        alt={`Gallery image ${index + 1}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnails Slider */}
            <div style={{ width: "90%", height: "90px" }} className="mt-4">
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                slidesPerView={9}
                spaceBetween={12}
                watchSlidesProgress
                className="h-100"
              >
                {gallery.slice().reverse().map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      className="img-fluid rounded"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      alt={`Gallery navigation thumbnail ${index + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
