"use client"
import { useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";

export default function ({ id, title, itinerary_pdf, footer }) {
  const [open, setOpen] = useState(false);
  const whatsappMessage = encodeURIComponent(
    `I want to book this package: ${title || id}`
  );

  return (
    <div className="min_box-detail asdfasdfasdfasd Age_limit container my-6 mt-24">
      <div className="d-flex align-items-center justify-content-center gap-3">

        <a
          href={`https://wa.me/919679945077?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "50px",
            minWidth: "50px",
            height: "50px",
            backgroundColor: "#e9f9ee",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            style={{ width: "24px", height: "24px" }}
          />
        </a>

        {/* Send Query Button */}
        <button
          onClick={() => setOpen({ id, title })}
          className="btn btn-primary w-100 px-4 py-2 rounded-pill fw-semibold"
        >
          Send Query
        </button>

        {/* Get PDF Button */}
        {itinerary_pdf != null && (
          <a
            href={itinerary_pdf}
            target="_blank"
            className="btn btn-primary w-100 px-4 py-2 rounded-pill fw-semibold"
          >
            Get PDF
          </a>
        )}
      </div>
      {open && <RequestCallback open={open} setOpen={setOpen} />}
    </div>
  );
}
