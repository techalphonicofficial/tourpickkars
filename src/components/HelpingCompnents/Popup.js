"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { getPagewithSection } from "@/services/pageSection";
import { api } from "@/services/config";

const popup = await getPagewithSection(6, "popup");

const Popup = () => {
  if (popup.section[0].data.status != "1") return null;

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    const lastClosed = localStorage.getItem("popupClosed");
    if (lastClosed) {
      const now = new Date().getTime();
      const expiry = parseInt(lastClosed);
      if (now - expiry < 7 * 24 * 60 * 60 * 1000) return;
    }

    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("booking/popup-enquiry", payload);

      if (res.data.status) {
        setMessage(res.data.message || "Enquiry submitted successfully!");
        formRef.current.reset(); // clear inputs
        localStorage.setItem("popupClosed", Date.now().toString()); // set localStorage
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setMessage(res.data.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("popupClosed", Date.now().toString()); // save close time
  };

  return (
    <>
      {isOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body p-0 d-flex flex-column flex-md-row">
                {/* Left Image */}
                <div className="col-md-6 d-none d-md-block">
                  <Image
                    src="/img/sale.webp"
                    alt="Left Side"
                    className="img-fluid h-100 w-100 rounded-start"
                    width={600}
                    height={800}
                  />
                </div>
                <div className="col-12 d-block d-md-none">
                  <Image
                    src="/img/sale.webp"
                    alt="Left Side Small"
                    className="img-fluid w-100"
                    width={600}
                    height={400}
                  />
                </div>

                {/* Right Form */}
                <div className="col-md-6 p-4 py-5">
                  <div className="mb-4 border-bottom pb-2 sec-title h4">
                    Plan your Next Trip
                  </div>

                  {message && (
                    <div className="col-12">
                      <div className="alert alert-info text-center mt-2 py-2">
                        {message}
                      </div>
                    </div>
                  )}

                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="row g-3"
                  >
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="fname"
                        className="form-control rounded-pill"
                        placeholder="First Name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="lname"
                        className="form-control rounded-pill"
                        placeholder="Last Name"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="tel"
                        name="contact"
                        className="form-control rounded-pill"
                        placeholder="Contact"
                        required
                        pattern="\d{10,12}"
                        title="Phone number must be 10 to 12 digits"
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="email"
                        name="email"
                        className="form-control rounded-pill"
                        placeholder="Email"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <textarea
                        name="message"
                        className="form-control"
                        placeholder="Message..."
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Close Button */}
                <div
                  className="d-flex justify-content-end position-absolute"
                  style={{ top: "16px", right: "16px" }}
                >
                  <button
                    type="button"
                    className="btn btn-light rounded-circle"
                    onClick={handleClose}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
