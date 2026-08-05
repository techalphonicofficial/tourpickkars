import { decrypt } from "@/functions/crypt";
import React, { useEffect, useState } from "react";

export default function TravellerDetail() {
  const [details, setDetails] = useState({
    full_name: "",
    phone: "",
    email: "",
  });
  useEffect(() => {
    setDetails(JSON.parse(decrypt(localStorage.getItem("personalDetails"))));
  }, []);

  return (
    <div className="min_box-detail container my-4 p-4">
      <div className="detail-section-header mb-4">
        <div className="section-title-premium m-0 h3">Traveller Information</div>
      </div>

      <div className="row g-4 px-2">
        {/* Traveler */}
        <div className="col-md-4">
          <div className="traveller-info-item">
            <div className="d-flex align-items-center gap-2 text-muted small mb-1">
              <span>👤</span> Traveler
            </div>
            <div className="fw-bold text-dark fs-5">{details.full_name || "Guest Traveller"}</div>
          </div>
        </div>

        {/* Phone */}
        <div className="col-md-4">
          <div className="traveller-info-item">
            <div className="d-flex align-items-center gap-2 text-muted small mb-1">
              <span>📞</span> Phone
            </div>
            <div className="fw-bold text-dark fs-5">{details.phone || "N/A"}</div>
          </div>
        </div>

        {/* Email */}
        <div className="col-md-4">
          <div className="traveller-info-item">
            <div className="d-flex align-items-center gap-2 text-muted small mb-1">
              <span>✉️</span> Email Address
            </div>
            <div className="fw-bold text-dark fs-6 text-truncate">{details.email || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
