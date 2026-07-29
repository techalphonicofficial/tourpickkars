import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import Image from "next/image";
import "./PopularTour.css";
import { createSlug } from "@/functions/createSlug";

export default function TourCard({ data, onRequestCallback }) {
  const dates =
    data.package_dates
      .slice(0, 3)
      .map((d) =>
        new Date(d.start_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
      )
      .join(", ") + (data.package_dates.length > 3 ? ", ..." : "");

  return (
    <div className="tour-box">
      {/* --- Image & Badges --- */}
      <div className="tour-box_img">
        <Link href={`/${createSlug(data.slug)}`}>
          <Image
            src={data.thumbnail}
            alt={data.title}
            fill
            className="tour-img"
          />
          <div className="tour_topbar">
            {data.pickup && data.drop && (
              <span className="tour-badge">
                <i><FontAwesomeIcon icon={faLocationDot} /></i>
                {data.pickup} to {data.drop}
              </span>
            )}
            {data.duration && (
              <span className="tour-badge" style={{ whiteSpace: 'nowrap', width: "75px", padding: "6px 6px" }}>
                <i><FontAwesomeIcon icon={faClock} /></i>
                {data.duration}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* --- Content Area --- */}
      <div className="tour-content-body">
        <h3 className="box-title">
          <Link href={`/${createSlug(data.slug)}`}>{data.title}</Link>
        </h3>

        <div className="tour-meta-info">
          <div className="tour-date">
            <i><FontAwesomeIcon icon={faCalendarDays} /></i>
            <span>{dates || "Next Batch Soon"}</span>
          </div>
          <div className="tour-price-wrapper">
            <span className="tour-price-amount">₹{Number(data.starting_price)}</span>
            <span className="tour-price-label">Per person</span>
          </div>
        </div>
      </div>

      {/* --- Action Section --- */}
      <div className="tour-action-group">
        <Link href="tel:8287828267" className="btn-call-outline" title="Call Us">
          <FontAwesomeIcon icon={faPhone} />
        </Link>
        <button
          onClick={() => onRequestCallback(data)}
          className="btn-request-callback"
        >
          <span>Request CallBack</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
