"use client";

import React, { useEffect, useMemo, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/functions/dateFunction";

// Dummy JSON data (replace with API response if needed)
const jsonData = {
  packageDetail: {
    slug: "trip-to-manali",
    enquiry_price: 19800,
  },
  activity_cost: [
    { activity: "Triple Occupancy", cost: 19800 },
    { activity: "Double Occupancy", cost: 22500 },
  ],
  packageDateRanges: [
    {
      id: 1,
      start_date: "2025-09-15T08:00:00",
      end_date: "2025-09-20T20:00:00",
      months: "Jan",
      note: "Hot",
      start_point: "Delhi",
      end_point: "Manali",
    },
    {
      id: 2,
      start_date: "2025-10-05T06:30:00",
      end_date: "2025-10-10T18:00:00",
      months: "Feb",
      note: "Available",
      start_point: "Mumbai",
      end_point: "Goa",
    },
    {
      id: 3,
      start_date: "2025-11-01T09:00:00",
      end_date: "2025-11-07T21:00:00",
      months: "Mar",
      note: "Full",
      start_point: "Bangalore",
      end_point: "Kerala",
    },
  ],
};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export default function Batches({ package_dates, drop, pickup }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [data, setData] = useState([]);

  const onDropDown = (index) => {
    setActiveIndex(index !== activeIndex ? index : null);
  };

  const groupedDates = useMemo(() => {
    const groups = package_dates.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const month = monthNames[date.getMonth()];

      if (!acc[month]) {
        acc[month] = { month, dates: [] };
      }
      acc[month].dates.push(item);
      return acc;
    }, {});

    const monthGroups = Object.values(groups);

    return [{ month: "All", dates: package_dates }, ...monthGroups];
  }, [package_dates]);

  useEffect(() => {
    const selectedGroup = groupedDates.find(
      (itm) => itm.month === selectedFilter
    );
    setData(selectedGroup.dates);
  }, [selectedFilter, groupedDates]);
  if (!package_dates || package_dates.length === 0) {
    return null;
  }
  return (
    <div className="min_box-detail batch_item container my-4 p-4">
      <div className="d-flex flex-sm-row flex-column justify-content-between align-items-center border-bottom pb-3 mb-4 gap-3">
        <div className="h3">Available Batches</div>
        <div className="d-flex gap-2 bg-smoke p-1 rounded-3 w-100" style={{ overflowX: "auto", scrollbarWidth: "thin" }}>
          {groupedDates.map((filter, index) => (
            <span
              key={index}
              className={`batch-filter-item ${selectedFilter === filter.month ? "active" : ""}`}
              onClick={() => (setSelectedFilter(filter.month), setActiveIndex(null))}
            >
              {filter.month}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 pe-2" style={{ maxHeight: "450px", overflowY: "auto" }}>
        {data.length <= 0 ? (
          <div className="text-center py-5">
            <span className="text-muted small">No trips available for {selectedFilter}</span>
          </div>
        ) : (
          data.map((batch, index) => (
            <div key={index} className="mb-3">
              <div
                className={`batch-card-premium ${activeIndex === index ? "active" : ""}`}
                onClick={() => onDropDown(index)}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="batch-calendar-icon">📅</div>
                  <div className="d-flex flex-column">
                    <span className="batch-date-display">
                      {formatDate(batch.start_date)} — {formatDate(batch.end_date)}
                    </span>
                    <span className="text-muted small">
                      {pickup.split(",")[0]} to {drop.split(",")[0]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className={`status-badge-premium ${batch.status?.toLowerCase() === "full" ? "bg-dark text-white" :
                    batch.status?.toLowerCase() === "fast-filling" ? "bg-danger text-white" :
                      batch.status?.toLowerCase() === "hot" ? "bg-warning text-dark" :
                        batch.status === "open" ? "bg-success text-white" : "bg-secondary text-white"
                    }`}>
                    {batch.status ? batch.status.toUpperCase() : "NO SEAT"}
                  </span>
                  <div className={`transition-transform ${activeIndex === index ? "rotate-180" : ""}`} style={{ transition: "0.3s" }}>
                    <span className="fs-5 opacity-50">↓</span>
                  </div>
                </div>
              </div>

              {activeIndex === index && (
                <div className="batch-info-expanded">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="batch-point-card shadow-sm h-100">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                          <span>📍</span> Departure from {pickup}
                        </div>
                        <div className="fw-bold text-dark">
                          {formatDate(batch.start_date)}
                          {(batch?.day_name || batch?.slots) && (
                            <span className="badge bg-primary-soft text-primary ms-2" style={{ position: 'inherit' }}>
                              {batch?.day_name?.slice(0, 3)}
                              {batch?.day_name && batch?.slots && ', '}
                              {(() => {
                                try {
                                  const parsed = JSON.parse(batch.slots);
                                  return Array.isArray(parsed) ? parsed.join(', ') : parsed;
                                } catch { return batch.slots; }
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="batch-point-card shadow-sm h-100">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                          <span>🏁</span> Arrival at {drop}
                        </div>
                        <div className="fw-bold text-dark">
                          {formatDate(batch.end_date)}
                          {(batch?.end_day || batch?.slot2) && (
                            <span className="badge bg-primary-soft text-primary ms-2" style={{ position: 'inherit' }}>
                              {batch?.end_day?.slice(0, 3)}
                              {batch?.end_day && batch?.slot2 && ', '}
                              {(() => {
                                try {
                                  const parsed = JSON.parse(batch.slot2);
                                  return Array.isArray(parsed) ? parsed.join(', ') : parsed;
                                } catch { return batch.slot2; }
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
