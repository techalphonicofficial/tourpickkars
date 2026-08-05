"use client";
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

export default function Coupons({ showPaymentSteps, setShowPaymentSteps }) {
  const [showModal, setShowModal] = useState(false);
  const [coupon, setCoupon] = useState("");

  return (
    <div className="min_box-detail Age_limit container my-4">
      {/* <RequestCallback/> */}
      {/* Title */}
      <div className="title d-flex justify-content-between gap-5">
        <div className="text-start fw-bold mb-4 page-title h6">Coupons & Offers</div>
      </div>

      {/* Coupons Row */}
      <div
        className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 mb-3 mt-4"
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      >
        <span>Coupons & Offers</span>
        <FontAwesomeIcon icon={faAngleRight} />
      </div>

      {/* Gift Card */}
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Enter Secret Code"
          className="form-control rounded-pill me-2"
        />
        <button className="btn btn-outline-primary rounded-pill px-4">
          Apply
        </button>
      </div>

      {/* GST Link */}
      <Link href="" className="text-primary small fw-semibold">
        Enter GST Details
      </Link>

      {/* Pricing Summary */}
      <div className="pricing_box mt-3">
        <div className="pricong-table mt-3 bg-light rounded-4 p-3">
          <ul className="list-unstyled mb-0">
            <li className="d-flex justify-content-between mb-2">
              Amount <span>₹23,500.00</span>
            </li>
            <li className="d-flex justify-content-between mb-2">
              GST (5%) <span>₹1,175.00</span>
            </li>
            <li className="d-flex justify-content-between fw-bold mb-2">
              Subtotal <span>₹24,675.00</span>
            </li>
            <hr />
            <li className="d-flex justify-content-between fw-bold">
              Amount To Pay <span>₹24,675.00</span>
            </li>
            <li className="d-flex justify-content-between fw-bold">
              Remaining Amount <span>₹24,675.00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Proceed / Make a Trip Button */}
      <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
      <button
        className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4" onClick={() => setShowPaymentSteps(false)} > <FontAwesomeIcon icon={faArrowAltCircleLeft}/> Back </button>
      <button
        className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
        onClick={() => setShowPaymentSteps(true)}
      >
        {showPaymentSteps ? "Make a Trip" : "Proceed to Payment"}
      </button>

      </div>

      {/* Popup Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1 }}
        >
          <div className="bg-white p-4 rounded-3 shadow-lg">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="fw-bold mb-0 h6">Coupons And Offers</div>
              <FontAwesomeIcon
                icon={faTimes}
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(false)}
              />
            </div>

            {/* Coupon Input */}
            <label className="small text-muted mb-2">Apply Coupon</label>
            <div className="d-flex align-items-center border rounded-3 ">
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                className="btn btn-link text-decoration-none text-primary fw-bold"
                onClick={() => {
                  alert(`Applied: ${coupon}`);
                  setShowModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
