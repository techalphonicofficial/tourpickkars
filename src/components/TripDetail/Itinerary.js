"use client";

import React, { useState } from "react";
import "./Itinerary.css";

export default function Itinerary({ itinerary, slots }) {
  const itineraryItems = Array.isArray(itinerary) ? itinerary : [];
  const startDay = slots === "evening" ? 0 : 1;
  const [openDays, setOpenDays] = useState(() => new Set([0]));

  const getHeading = (heading, dayNumber) => {
    const text = String(heading || "").replace(/<[^>]*>/g, "").trim();
    return text.replace(
      new RegExp(`^[^A-Za-z0-9]*day\\s*${dayNumber}\\s*[:|\\-]?\\s*`, "i"),
      ""
    );
  };

  if (itineraryItems.length === 0) {
    return null;
  }

  const toggleDay = (index) => {
    setOpenDays((currentOpenDays) => {
      const nextOpenDays = new Set(currentOpenDays);

      if (nextOpenDays.has(index)) {
        nextOpenDays.delete(index);
      } else {
        nextOpenDays.add(index);
      }

      return nextOpenDays;
    });
  };

  return (
    <div className="min_box-detail Age_limit container my-4 enlive-itinerary-box">
      <div className="title enlive-itinerary-title">
        <h6 className="text-start fw-bold mb-0 page-title">Itinerary</h6>
        <span className="enlive-itinerary-count">
          {itineraryItems.length} Days
        </span>
      </div>

      <div className="enlive-itinerary-list">
        {itineraryItems.map((item, index) => {
          const dayNumber = index + startDay;
          const heading = getHeading(item.heading, dayNumber);
          const isOpen = openDays.has(index);
          const contentId = `itinerary-day-${index}`;

          return (
            <article
              className={`enlive-itinerary-day ${
                isOpen ? "enlive-itinerary-day--open" : ""
              }`}
              key={index}
            >
              <div className="enlive-itinerary-marker" aria-hidden="true">
                <span>{dayNumber}</span>
              </div>

              <div className="enlive-itinerary-content">
                <button
                  className="enlive-itinerary-toggle"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleDay(index)}
                >
                  <span className="enlive-itinerary-heading">
                    <span>Day {dayNumber}</span> {heading}
                  </span>
                  <span className="enlive-itinerary-chevron" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div
                  id={contentId}
                  className="enlive-itinerary-html"
                  hidden={!isOpen}
                  dangerouslySetInnerHTML={{ __html: item.content || "" }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
