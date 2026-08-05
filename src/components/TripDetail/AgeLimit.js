"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

// Dummy age limit data
const dummyAgeLimit = [
  {
    id: 1,
    title: "Backpacking Trips",
    age_limit: "18 - 40",
  },
  {
    id: 2,
    title: "Weekend Getaways",
    age_limit: "18 - 38",
  },
  {
    id: 3,
    title: "Himalayan Treks",
    age_limit: "18 - 48",
  },
  {
    id: 4,
    title: "Biking Trips",
    age_limit: "18 - 45",
  },
  {
    id: 6,
    title: "Customized Trips",
    age_limit: "No Limit",
  },
];

export default function AgeLimit() {
  const [ageLimit, setAgeLimit] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    setAgeLimit(dummyAgeLimit);
  }, []);

  return (
    <div className="min_box-detail Age_limit container my-5">
      {/* Age Limit Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-light">
        <div className="icon-box rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#e9f9ee' }}>
          <FontAwesomeIcon icon={faUsers} style={{ color: '#00ba9d', fontSize: '1.2rem' }} />
        </div>
        <div className="h3">Age Limit (Trip Wise)</div>
      </div>

      {/* Cards Grid */}
      <div className="row g-3">
        {ageLimit.map((item) => (
          <div key={item.id} className="col-lg-auto col-md-4 col-6 flex-grow-1">
            <div 
              className="age-card h-100 border p-3 text-center rounded-4 position-relative overflow-hidden shadow-sm" 
              style={{ backgroundColor: '#ffffff', transition: 'all 0.3s ease', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              {/* Accent top border */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#00ba9d', opacity: 0.8 }}></div>
              
              <div className="d-flex flex-column justify-content-center h-100">
                <p className="fw-semibold text-secondary text-uppercase tracking-wider m-0 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  {item.title}
                </p>
                <div className="fw-bolder m-0 h3" style={{ color: '#2c3e50', fontSize: '1.2rem' }}>
                  {item.age_limit} 
                  {item.age_limit !== "No Limit" && (
                    <span className="text-muted fw-normal ms-1" style={{ fontSize: '0.8rem' }}>Yrs</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .age-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 186, 157, 0.12) !important;
          border-color: #00ba9d !important;
        }
      `}</style>
    </div>
  );
}
