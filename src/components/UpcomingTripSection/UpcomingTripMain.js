"use client";
import UpcomingTripSection from "./UpcomingTripSection";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function UpcomingTripMain({ tripsWithcount }) {
  const [byCategory, setByCategory] = useState("all");
  const [resetKey, setResetKey] = useState(0);
  const [hasDateFilter, setHasDateFilter] = useState(false);

  const handleClearFilters = () => {
    setByCategory("all");
    setResetKey(prev => prev + 1);
    setHasDateFilter(false);
  };

  return (
    <div className="row py-5">
      {/* Sidebar */}
      <div className="col-xxl-3 col-lg-4 mb-5">
        <aside className="sidebar-area sticky-top" style={{ top: "120px", zIndex: 10 }}>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="h5 fw-bolder mb-0 text-dark h3">Destinations</div>
            {(byCategory !== "all" || hasDateFilter) && (
              <button
                onClick={handleClearFilters}
                className="btn btn-sm btn-light text-danger rounded-pill px-3 py-1 fw-bold"
                style={{ fontSize: "12px", transition: "all 0.3s ease", border: "1px solid #fee2e2" }}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Clear Filter
              </button>
            )}
          </div>
          <div className="custom-sidebar-widget bg-white rounded-4 shadow-sm p-4 border border-light">

            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li
                className={`rounded-3 py-2 px-3 fw-bold d-flex justify-content-between align-items-center ${byCategory === "all" ? "text-white shadow-sm" : "bg-light text-secondary"}`}
                onClick={() => setByCategory("all")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: byCategory === "all" ? "var(--theme-color)" : ""
                }}
              >
                <span>All Trips</span>
                {byCategory === "all" && <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "12px" }} />}
              </li>

              {tripsWithcount.map((item) => {
                const isActive = byCategory === item.id;
                return (
                  <li
                    className={`rounded-3 py-2 px-3 fw-bold d-flex justify-content-between align-items-center ${isActive ? "text-white shadow-sm" : "bg-light text-secondary"}`}
                    key={item.id}
                    onClick={() => setByCategory(item.id)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: isActive ? "var(--theme-color)" : ""
                    }}
                  >
                    <span>{item.heading}</span>
                    <span
                      className={`badge rounded-pill d-flex align-items-center justify-content-center`}
                      style={{
                        fontSize: "12px",
                        width: "28px",
                        height: "28px",
                        backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                        color: isActive ? "#fff" : "#64748b", position: "inherit"
                      }}
                    >
                      {item.active_packages_count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="col-xxl-9 col-lg-8">
        <div className="visually-hidden h2">Upcoming Trips</div>
        <UpcomingTripSection
          byCategory={byCategory}
          resetKey={resetKey}
          setHasDateFilter={setHasDateFilter}
        />
      </div>
    </div>
  );
}
