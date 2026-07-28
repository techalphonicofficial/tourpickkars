"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

export default function TripHero({ title, duration, age_group, pickup, drop, banner }) {
  const route = [pickup, drop].filter(Boolean).join(" -> ");

  return (
    <div className="trip-hero package-mobile-hero position-relative">
      <Image
        className="img-fluid w-100 trip-hero-img"
        width={1900}
        height={800}
        src={banner}
        alt={title}
      />

      <div className="trip-hero-overlay position-absolute bottom-0 w-100">
        <div className="container th-container">
          <div className="trip-hero-content text-white">
            <h1 className="trip-hero-title fw-bold text-white">
              {title}
            </h1>

            <div className="trip-hero-meta">
              <div className="trip-hero-meta-item">
                <div className="icon-circle mb-2">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <p className="small mb-1 fw-semibold text-white text-nowrap">Duration</p>
                <p className="mb-0 text-white">{duration || "N/A"}</p>
              </div>

              <div className="trip-hero-meta-item">
                <div className="icon-circle mb-2">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <p className="small mb-1 fw-semibold text-white text-nowrap">Age Limit</p>
                <p className="mb-0 text-white">{age_group || "N/A"}</p>
              </div>

              <div className="trip-hero-meta-item">
                <div className="icon-circle mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <p className="small mb-1 fw-semibold text-white text-nowrap">Pick-up & Drop</p>
                <p className="mb-0 text-white">{route || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
