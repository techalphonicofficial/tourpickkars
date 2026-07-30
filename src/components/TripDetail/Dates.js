"use client";
import React, { useState, useEffect } from "react";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertMyDate } from "@/functions/dateFunction";

function Dates({ active_costs, package_dates }) {
  const [specialDates, setSpecialDates] = useState([]);

  useEffect(() => {
    // console.log(package_dates);
    setSpecialDates(package_dates.filter((item) => item.special == 1));
  }, []);

  return (
    <div className="min_box-detail Age_limit package-pricing-section container my-4 mt-24">
      <div className="dates-section my-4">
        <h2 className="visually-hidden">Pricing Details</h2>
        {/* Regular Dates */}
        <div className="package-price-heading d-flex align-items-center mb-4 pb-3 border-bottom border-light">
          <div className="icon-box rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#e9f9ee' }}>
            <img src="/img/icon/regular_date.png" alt="Regular Date" style={{ width: '28px', objectFit: 'contain' }} />
          </div>
          <h3 className="m-0 fw-bold" style={{ color: '#2c3e50', letterSpacing: '-0.5px' }}>Regular Price</h3>
        </div>

        <div className="row g-4 mb-5">
          {active_costs.map((activity, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="activity-card h-100 border p-4 text-center rounded-4 position-relative overflow-hidden"
                style={{ backgroundColor: '#ffffff', transition: 'all 0.3s ease', borderColor: 'rgba(0,0,0,0.05)' }}
              >
                {/* Accent Top Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#00ba9d', opacity: 0.8 }}></div>

                <div className="package-activity-title fw-bold text-secondary text-uppercase tracking-wider mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                  {activity.activity}
                </div>

                <div className="price-display d-flex flex-column align-items-center justify-content-center">
                  <span className="text-decoration-line-through text-muted small fw-medium mb-1">
                    <FontAwesomeIcon icon={faIndianRupee} className="me-1" style={{ fontSize: '0.8em' }} />
                    {Number(activity.cost)}
                  </span>

                  <h3 className="package-price-amount fw-bolder m-0" style={{ color: '#00ba9d', fontSize: '1.8rem' }}>
                    <FontAwesomeIcon icon={faIndianRupee} className="me-1 fa-sm" />
                    {Number(activity.total_with_discount)}
                  </h3>

                  <span className="badge bg-light text-secondary mt-3 px-3 py-2 rounded-pill fw-medium border" style={{ fontSize: '0.75rem', position: 'inherit' }}>
                    + {Number(activity.gst_percent)}% GST
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Dates */}
        {specialDates.length != 0 ? (
          <>
            <div className="package-price-heading d-flex align-items-center mb-4 pb-3 border-bottom border-light mt-5">
              <div className="icon-box rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#fff5e6' }}>
                <img src="/img/icon/party_emoji.png" alt="Special Dates" style={{ width: '28px', objectFit: 'contain' }} />
              </div>
              <h3 className="m-0 fw-bold" style={{ color: '#2c3e50', letterSpacing: '-0.5px' }}>Special Dates Price</h3>
            </div>

            <div className="row justify-content-center">
              {specialDates.map((item) => (
                <div className="col-12 mb-5" key={item.id}>
                  <div className="special-date-range-wrap d-inline-flex align-items-center mb-4 bg-light py-2 px-4 rounded-pill border" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <p className="date-range m-0 fw-bold text-dark d-flex align-items-center gap-2">
                      <span className="badge text-white rounded-pill px-3 py-2" style={{ backgroundColor: '#2c3e50' }}>{convertMyDate(item.start_date)}</span>
                      <span className="text-muted fw-normal">to</span>
                      <span className="badge text-white rounded-pill px-3 py-2" style={{ backgroundColor: '#2c3e50' }}>{convertMyDate(item.end_date)}</span>
                    </p>
                  </div>
                  <div className="row g-4">
                    {active_costs.map((activity, idx) => (
                      <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                          className="activity-card h-100 border p-4 text-center rounded-4 position-relative overflow-hidden"
                          style={{ backgroundColor: '#ffffff', transition: 'all 0.3s ease', borderColor: 'rgba(0,0,0,0.05)' }}
                        >
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#fb8c00', opacity: 0.8 }}></div>

                          <div className="package-activity-title fw-bold text-secondary text-uppercase tracking-wider mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                            {activity.activity}
                          </div>

                          <div className="price-display d-flex flex-column align-items-center justify-content-center">
                            {Number(item.increase_amount_by_percent) > 0 ? (
                              <>
                                <h3 className="package-price-amount fw-bolder m-0" style={{ color: '#fb8c00', fontSize: '1.8rem' }}>
                                  <FontAwesomeIcon icon={faIndianRupee} className="me-1 fa-sm" />
                                  {Number(activity.total_with_discount) + (Number(activity.total_with_discount) * Number(item.increase_amount_by_percent) / 100)}
                                </h3>
                              </>
                            ) : Number(item.decrease_amount_by_percent) > 0 ? (
                              <>
                                <h3 className="package-price-amount fw-bolder m-0" style={{ color: '#fb8c00', fontSize: '1.8rem' }}>
                                  <FontAwesomeIcon icon={faIndianRupee} className="me-1 fa-sm" />
                                  {Number(activity.total_with_discount) - (Number(activity.total_with_discount) * Number(item.decrease_amount_by_percent) / 100)}
                                </h3>
                              </>
                            ) : (
                              <>
                                <h3 className="package-price-amount fw-bolder m-0" style={{ color: '#fb8c00', fontSize: '1.8rem' }}>
                                  <FontAwesomeIcon icon={faIndianRupee} className="me-1 fa-sm" />
                                  {Number(activity.total_with_discount)}
                                </h3>
                              </>
                            )}
                            <span className="badge bg-light text-secondary mt-3 px-3 py-2 rounded-pill fw-medium border" style={{ fontSize: '0.75rem' }}>
                              + {Number(activity.gst_percent)}% GST
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      <style jsx global>{`
        .activity-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 186, 157, 0.1) !important;
          border-color: #00ba9d !important;
        }
      `}</style>
    </div>
  );
}

export default Dates;
