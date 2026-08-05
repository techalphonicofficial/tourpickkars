import { decrypt, encrypt } from "@/functions/crypt";
import { formatDate } from "@/functions/dateFunction";
import React, { useEffect, useState } from "react";

export default function AvailableDates({ groupedDates, handleSetDates, slug }) {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const bookingData = (() => {
      try {
        return JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
      } catch {
        return {};
      }
    })();

    localStorage.setItem(
      `enlive_${slug}`,
      encrypt(JSON.stringify({ ...bookingData, selectedBatch }))
    );
    handleSetDates(selectedBatch);
  }, [selectedBatch]);

  useEffect(() => {
    if (groupedDates.length === 0) return;
    const selectedGroup = groupedDates.find(
      (itm) => itm.month === selectedMonth
    );
    if (selectedGroup) {
      setDates(selectedGroup.dates);
    }
  }, [selectedMonth, groupedDates]);

  return (
    <div className="min_box-detail mb-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="section-title-premium m-0 h3">Select Your Batch</div>

        <div className="filter-btn-group">
          {groupedDates.map((month) => (
            <button
              key={month.month}
              onClick={() => setSelectedMonth(month.month)}
              className={`filter-btn-premium ${selectedMonth === month.month ? "active" : ""}`}
            >
              {month.month}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3">
        {dates.map((batch, index) => {
          const status = batch?.status?.toLowerCase();
          if (["full", "no seat", "closed"].includes(status)) return null;

          const isActive = selectedBatch === batch.id;

          return (
            <div key={index} className="col-md-6">
              <div
                className={`batch-card-premium ${isActive ? "active" : ""}`}
                onClick={() => setSelectedBatch(batch.id)}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="batch-date-info d-flex ">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="text-primary">📅</span>
                      <span className="fw-bold text-dark">
                        {formatDate(batch.start_date)}
                      </span>
                    </div>
                    <div className="text-muted  ps-1">
                      to <span className="fw-bold text-dark">{formatDate(batch.end_date)}</span>
                    </div>
                  </div>

                  <span className={`badge rounded-pill px-3 py-2 ${status === "fast-filling" ? "bg-danger" :
                    status === "hot" ? "bg-warning text-dark" :
                      "bg-success"
                    }`}>
                    {batch.status ? batch.status.toUpperCase() : "AVAILABLE"}
                  </span>
                </div>

                {(batch?.day_name || batch?.slots) && (
                  <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center gap-2">
                    <span className="text-muted small">🕒</span>
                    <span className="small fw-semibold text-secondary">
                      {batch?.day_name?.slice(0, 3)}
                      {batch?.day_name && batch?.slots && ', '}
                      {(() => {
                        const capitalize = (str) =>
                          str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
                        try {
                          const parsed = JSON.parse(batch.slots);
                          return Array.isArray(parsed) ? parsed.map(capitalize).join(', ') : capitalize(parsed);
                        } catch {
                          return capitalize(batch.slots);
                        }
                      })()}
                      &nbsp;to&nbsp;
                      {batch?.end_day?.slice(0, 3)}
                      {batch?.end_day && batch?.slot2 && ', '}
                      {(() => {
                        const capitalize = (str) =>
                          str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
                        try {
                          const parsed = JSON.parse(batch.slot2);
                          return Array.isArray(parsed) ? parsed.map(capitalize).join(', ') : capitalize(parsed);
                        } catch {
                          return capitalize(batch.slot2);
                        }
                      })()}
                    </span>
                  </div>
                )}

                <div className="selection-indicator">
                  <input
                    type="radio"
                    className="form-check-input mt-0"
                    name="batch"
                    checked={isActive}
                    readOnly
                    style={{ position: 'absolute', opacity: 0 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
