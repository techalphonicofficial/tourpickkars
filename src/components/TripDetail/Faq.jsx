"use client";
import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function Faq({ faqs }) {
  // Load bootstrap JS for accordion toggle
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className=" min_box-detail Age_limit container my-5 mt-24 position-relative z-0">
      <div className="title">
        <div className="h3">
          Frequently Asked Questions
        </div>
      </div>

      <div className="accordion-area accordion mb-30 mt-3" id="faqAccordion">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`accordion-card style2 ${index === 0 ? "active" : ""}`}
          >
            <div className="accordion-header" id={`heading-${index}`}>
              <button
                className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse-${index}`}
              >
                {item.question}
              </button>
            </div>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${
                index === 0 ? "show" : ""
              }`}
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body style2">
                <p className="faq-text">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
