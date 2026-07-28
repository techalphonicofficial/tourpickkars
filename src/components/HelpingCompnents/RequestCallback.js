"use client";
import { api } from "@/services/config"; // <- axios instance
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function RequestCallback({ heading = "Request Callback", open, setOpen }) {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when modal is open
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/packages/request-call-back", payload);

      if (res.data.success) {
        setMessage(res.data.message || "Callback requested successfully!");
        formRef.current.reset();
        setTimeout(() => setOpen(false), 2000);
      } else {
        setMessage(res.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-success">{heading}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            ></button>
          </div>
          <div className="modal-body">
            <form ref={formRef} onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="package_id"
                value={typeof open === "object" ? open.id : open}
              />
              <div className="mb-3">
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  required
                  pattern="\d{10}"
                  title="Phone number must be 10 digits"
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="d-flex gap-3" >

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <a
                  href={`https://wa.me/919679945077?text=${encodeURIComponent(
                    `I want to book this package: ${typeof open === "object" && open?.title ? open.title : open}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', backgroundColor: '#ffffff', borderRadius: '50%', overflow: 'hidden', padding: '0px' }}
                >
                  <img src="/img/icon/whatsapp.png" alt="WhatsApp" width={50} height={50} style={{ backgroundColor: 'transparent', objectFit: 'contain', borderRadius: '50%', overflow: 'hidden' }} />
                </a>
              </div>

              {message && (
                <div className="alert alert-info text-center mt-3 py-2">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
