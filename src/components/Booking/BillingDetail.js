import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";
import { decrypt, encrypt } from "@/functions/crypt";

const validate = (data) => {
  let errs = {};

  // full_name validation
  if (!data.full_name || data.full_name.trim().length < 3) {
    errs.full_name = "Full name must be at least 3 characters";
  }

  // phone validation
  if (!data.phone) {
    errs.phone = "Phone is required";
  } else if (!/^[0-9]{10}$/.test(data.phone)) {
    errs.phone = "Phone must be 10 digits only";
  }

  // email validation
  if (!data.email) {
    errs.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errs.email = "Email is not valid";
  }

  return errs;
};

export default function BillingDetail({
  setFormCompleted,
  formCompleted,
  slug,
}) {
  const [payload, setPayload] = useState(null);

  const [personalDetails, setPersonalDetails] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const errs = validate(personalDetails);

    if (Object.keys(errs).length === 0) {
      setFormCompleted(true);
      localStorage.setItem("personalDetails", encrypt(JSON.stringify(personalDetails)));
      const bookingData = (() => {
        try {
          return JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
        } catch {
          return {};
        }
      })();

      localStorage.setItem(
        `enlive_${slug}`,
        encrypt(JSON.stringify({
          ...bookingData,
          ...personalDetails,
        }))
        
      );
      setPayload(personalDetails);
    } else {
      setFormCompleted(false);
      setPayload(errs);
    }
  }, [personalDetails]);

  return (
    <div className="min_box-detail container my-4 p-4">
      <div className="detail-section-header mb-4 text-center">
        <div className="section-title-premium h3">Personal Details</div>
        <p className="text-muted small">Please provide your details to continue with booking</p>
      </div>

      <div className="row g-4">
        {/* Full Name */}
        <div className="col-12">
          <div className="booking-input-group">
            <label className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
              <span>👤</span> Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={personalDetails.full_name}
              className={`form-control-premium ${payload?.full_name && personalDetails.full_name !== "" && !formCompleted ? "is-invalid-active" : ""}`}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  full_name: e.target.value,
                })
              }
            />
            {payload?.full_name && personalDetails.full_name !== "" && !formCompleted && (
              <div className="invalid-feedback-premium">{payload.full_name}</div>
            )}
          </div>
        </div>

        {/* Contact No */}
        <div className="col-md-6">
          <div className="booking-input-group">
            <label className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
              <span>📞</span> Contact No
            </label>
            <input
              type="text"
              placeholder="10-digit mobile number"
              value={personalDetails.phone}
              className={`form-control-premium ${payload?.phone && personalDetails.phone !== "" && !formCompleted ? "is-invalid-active" : ""}`}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  phone: e.target.value,
                })
              }
            />
            {payload?.phone && personalDetails.phone !== "" && !formCompleted && (
              <div className="invalid-feedback-premium">{payload.phone}</div>
            )}
          </div>
        </div>

        {/* E-mail */}
        <div className="col-md-6">
          <div className="booking-input-group">
            <label className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
              <span>✉️</span> E-mail Address
            </label>
            <input
              type="email"
              placeholder="yourname@example.com"
              value={personalDetails.email}
              className={`form-control-premium ${payload?.email && personalDetails.email !== "" && !formCompleted ? "is-invalid-active" : ""}`}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  email: e.target.value,
                })
              }
            />
            {payload?.email && personalDetails.email !== "" && !formCompleted && (
              <div className="invalid-feedback-premium">{payload.email}</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <RequestCallback />
      </div>
    </div>
  );
}
