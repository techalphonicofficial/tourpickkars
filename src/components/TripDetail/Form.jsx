"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { createSlug } from "@/functions/createSlug";

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

const Form = ({ loaded }) => {
  const [selectedOccupancy, setSelectedOccupancy] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [data, setData] = useState();
  const [anotherLoading, setAnotherLoading] = useState(true);

  useEffect(() => {
    setData(jsonData);
    setAnotherLoading(false);
  }, []);

  const onDropDown = (index) => {
    setActiveIndex(index !== activeIndex ? index : null);
  };

  const handleOccupancyChange = (occupancy) => {
    setSelectedOccupancy(occupancy);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function extractTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  }

  // ✅ Filter by month
  const filteredData =
    selectedFilter === "All"
      ? data?.packageDateRanges
      : data?.packageDateRanges.filter(
          (batch) => batch.months === selectedFilter
        );

  return (
    <div className="bg-light rounded p-3">
      {/* Price Section */}
      <div className="bg-success bg-opacity-10 p-3 rounded mb-3">
        <div className="fw-bold text-secondary h6 h3">
          {!loaded && !anotherLoading ? (
            "Starting From"
          ) : (
            <Skeleton width={100} />
          )}
        </div>
        <div className="mt-2">
          {!loaded && !anotherLoading ? (
            <div className="fw-bold text-dark h4">
              <FontAwesomeIcon icon={faRupeeSign} />{" "}
              {data?.packageDetail?.enquiry_price}{" "}
              <small className="fw-normal">/- per person</small>
            </div>
          ) : (
            <Skeleton width={80} height={20} />
          )}
        </div>
        <div className="d-flex gap-2 mt-3">
          <Link href={`/booking/${createSlug(data?.packageDetail?.slug)}`}>
            {!loaded && !anotherLoading ? (
              <button className="btn btn-success rounded-pill px-4">
                Book Now
              </button>
            ) : (
              <Skeleton height={40} width={120} borderRadius={20} />
            )}
          </Link>
          {!loaded && !anotherLoading ? (
            <button
              className="btn btn-success rounded-pill px-4"
              onClick={() => alert("Send Query Clicked!")}
            >
              Send Query
            </button>
          ) : (
            <Skeleton height={40} width={120} borderRadius={20} />
          )}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-success bg-opacity-10 p-3 rounded mb-3">
        <div className="d-flex justify-content-between border-bottom pb-2">
          <div className="fw-bold h6 h3">Pricing</div>
          <div>
            <span className="me-2">Occupancy -</span>
            {data?.activity_cost?.map((item, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  index === selectedOccupancy
                    ? "btn-success"
                    : "btn-outline-success"
                } me-2`}
                onClick={() => handleOccupancyChange(index)}
              >
                {item.activity.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          {!loaded && !anotherLoading && (
            <div className="d-flex justify-content-between border rounded p-2">
              <span className="fw-semibold">
                {data?.activity_cost[selectedOccupancy]?.activity}
              </span>
              <span className="text-success fw-bold">
                <FontAwesomeIcon icon={faRupeeSign} />{" "}
                {data?.activity_cost[selectedOccupancy]?.cost}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Batches Section */}
      <div className="bg-success bg-opacity-10 p-3 rounded">
        <div className="d-flex justify-content-between border-bottom pb-2">
          <div className="fw-bold h6 h3">Batches</div>
          <div className="d-flex gap-3">
            {["All", "Jan", "Feb", "Mar"].map((filter) => (
              <span
                key={filter}
                className={`cursor-pointer ${
                  selectedFilter === filter
                    ? "fw-bold text-success border-bottom border-success"
                    : ""
                }`}
                onClick={() => (setSelectedFilter(filter), setActiveIndex(null))}
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3" style={{ maxHeight: "350px", overflowY: "auto" }}>
          {filteredData?.length <= 0 ? (
            <span className="text-danger small">
              No Trips Available for the Selected Filter
            </span>
          ) : (
            filteredData?.map((batch, index) => (
              <div key={batch.id} className="mb-2">
                <div
                  className="d-flex justify-content-between align-items-center border rounded p-2 bg-white"
                  onClick={() => onDropDown(index)}
                  style={{ cursor: "pointer" }}
                >
                  <span>
                    {formatDate(batch.start_date)} - {formatDate(batch.end_date)}
                  </span>
                  <div className="d-flex align-items-center gap-2 position-relative">
                    {/* ✅ Status Badge */}
                    <span
                      className={`badge rounded-2 top-0 ${
                        batch.note === "Full"
                          ? "bg-danger"
                          : batch.note === "Hot"
                          ? "bg-warning text-dark"
                          : batch.note === "Available"
                          ? "bg-success"
                          : "bg-secondary"
                      }`} style={{right:"32px",fontSize:"14px"}}
                    >
                      {batch.note || "No Seat"}
                    </span>
                    <FontAwesomeIcon icon={faArrowDown} />
                  </div>
                </div>
                {activeIndex === index && (
                  <div className="bg-light rounded p-2 mt-1 small">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>Start Point:</strong> {batch.start_point}
                        <br />
                        ({formatDate(batch.start_date)},{" "}
                        {extractTime(batch.start_date)})
                      </div>
                      <div>
                        <strong>End Point:</strong> {batch.end_point}
                        <br />
                        ({formatDate(batch.end_date)},{" "}
                        {extractTime(batch.end_date)})
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
