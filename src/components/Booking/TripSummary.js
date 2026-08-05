"use client";
import { decrypt, encrypt } from "@/functions/crypt";
import { formatDate } from "@/functions/dateFunction";
import { singlePackage } from "@/services/packageApi";
import { faCalendarAlt, faClock } from "@fortawesome/free-regular-svg-icons";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TripSummary({selectedDate}) {
  const [trip, setTrip] = useState(null);
  const { slug } = useParams();
  useEffect(() => {
    if (!slug) return;
    async function fetchTrip() {
      try {
        const res = await singlePackage(slug);
        setTrip(res);
        const bookingData = (() => {
        try {
          return JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
        } catch {
          return {};
        }
      })();

      localStorage.setItem(
        `enlive_${slug}`,
        encrypt(
        JSON.stringify({
          ...bookingData,
          package_title:res.title,
          duration:res.duration,
          pickup:res.pickup,
          drop:res.drop,
        })
        )
      );
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      }
    }
    fetchTrip();
  }, [slug]);

  if(trip == null) return;
  return (
    <div className="min_box-detail container my-4 p-4">
      <div className="detail-section-header mb-4">
        <div className="section-title-premium h3">Trip Summary</div>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="premium-icon-box">
              <span className="fs-3">🌍</span>
            </div>
            <div>
              <div className="fw-bold text-dark m-0 h4">
                {trip.title}
              </div>
              <span className="badge bg-primary-soft text-primary rounded-pill px-3 py-1 mt-1">
                {trip.duration}
              </span>
            </div>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="summary-info-card shadow-sm p-3 rounded-4 border">
                <div className="text-muted small mb-1">Route</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                  <span>📍</span>
                  {trip.pickup} → {trip.drop}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="summary-info-card shadow-sm p-3 rounded-4 border">
                <div className="text-muted small mb-1">Duration</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                  <span>⏱️</span>
                  {trip.duration.split("-")[1].replace("D", "")} Days
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="summary-info-card shadow-sm p-3 rounded-4 border">
                <div className="text-muted small mb-1">Travel Dates</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                  <span>📅</span>
                  {formatDate(selectedDate.start_date)} to {formatDate(selectedDate.end_date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
