"use client";
import React from "react";
import ShareButton from "./ShareButton";

export default function TripInfo({ trip, completedata }) {
  const serviceItems = [
    { label: "Meals", icon: "/img/icon/Meals.svg" },
    { label: "Stays", icon: "/img/icon/Stays.svg" },
    { label: "Transfers", icon: "/img/icon/Transfers.svg" },
    { label: "Activities", icon: "/img/icon/Activities.svg" },
  ];

  return (
    <div className="enlive-package-summary min_box-detail Age_limit package-detail-info container my-4">
      <div className="package-summary-share d-flex justify-content-end mb-4">
        <ShareButton
          packageLink={completedata?.slug}
          packageName={trip}
        />
      </div>

      <div className="detail-section enlive-service-block">
        <div className="package-detail-grid package-detail-grid-features mb-0">
          {serviceItems.map((item) => (
            <div
              className="jtym package-detail-card package-service-card d-flex align-items-center gap-3 py-3 px-4"
              key={item.label}
            >
              <img src={item.icon} alt="" />
              <div className="deta_content">
                <p className="sadasd">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
