"use client";
import React, { useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";
import { createSlug } from "@/functions/createSlug";

export default function BookNow({ id, title, slug, starting_price, bookingButton }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="enlive-booking-card min_box-detail uiymyumyumyum package-booking-card Age_limit container my-4 mt-80">
      <div className="package-booking-price mb-4">
        <span className="booking-price-label">Starting From</span>
        <div className="d-flex align-items-end justify-content-between gap-3 mt-2">
          <h3 className="fw-bold text-primary mb-0">
            Rs {Number(starting_price)}/-
          </h3>
          <span className="booking-price-unit bg-light text-dark rounded-pill px-3 py-2">
            Per Person
          </span>
        </div>
      </div>

      <div className="package-booking-actions d-flex flex-column gap-3">
        {bookingButton && (
          <a
            href={`/booking/${createSlug(slug)}`}
            className="btn btn-primary w-100 py-3 rounded-pill fw-semibold"
          >
            Book Now
          </a>
        )}
        <button
          className="btn btn-outline-primary w-100 py-3 rounded-pill fw-semibold"
          onClick={() => setOpen({ id, title })}
        >
          Send Inquiry
        </button>
      </div>
      {open && <RequestCallback open={open} setOpen={setOpen} />}
    </div>
  );
}
