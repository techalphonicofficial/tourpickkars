"use client";
import { api } from "@/services/config";
import { getDestination } from "@/services/destinationApi";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

export default function ContactUsForm({ heading, banner, video }) {
  const [destinations, setDestinations] = useState([]);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/packages/send-enquiry", payload);
      if (res.data.success == true) {
        setMessage(res.data.message);
        formRef.current.reset(); // clear form
      }
    } catch (error) {
      console.log(error.response.data);
      setMessage(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await getDestination();
        setDestinations(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchDestinations();
  }, []);

  return (
    <div
      className=" "
      style={{
        backgroundImage: `url('${process.env.NEXT_PUBLIC_MEDIA_PATH + banner}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: 'relative'
      }}
    >
      <div className="absolute inset-0 bg-white opacity-90"></div>
      <div className="container position-relative">
        <div className="row gy-5 justify-content-center align-items-center">
          {/* Video Section */}
          <div className="col-lg-6">
            <div className="text-lg-start text-center">
              <span className="sub-title text-white">Watch Our Journey</span>
              <h2 className="display-5 fw-800 mb-4 lh-sm text-white">See the Adventure Through Our Eyes</h2>
              <p className="text-white mb-5 pe-lg-5">We don't just organize trips — we craft unforgettable moments. Check out our latest travels and find inspiration for your next great adventure with Tour Pickkars.</p>

              <div className="d-flex justify-content-lg-start justify-content-center">
                <a
                  href={video}
                  className="contact-video-btn popup-video text-decoration-none"
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faPlay} />
                </a>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="col-lg-6 mb-4">
            <div className="premium-contact-form-box">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="ajax-contact"
              >
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-capitalize m-0">{heading}</h3>
                  <div className="h-1 bg-theme mx-auto mt-2" style={{ width: '50px', height: '3px' }}></div>
                </div>

                <div className="row">
                  {/* Name */}
                  <div className="col-12">
                    <div className="form-floating-premium">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="col-md-6">
                    <div className="form-floating-premium">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating-premium">
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        placeholder="Phone Number"
                        required
                        pattern="\d{10,12}"
                      />
                    </div>
                  </div>

                  {/* Age & Date */}
                  <div className="col-6">
                    <div className="form-floating-premium">
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        placeholder="Age"
                        required
                        min="18"
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-floating-premium">
                      <input
                        type="date"
                        className="form-control"
                        name="travel_date"
                        required
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="col-12">
                    <div className="form-floating-premium">
                      <select
                        name="destination"
                        className="form-select"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>Select Your Destination</option>
                        {destinations.map((dest, index) => (
                          <option key={index} value={dest.name}>{dest.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <div className="form-floating-premium">
                      <textarea
                        name="message"
                        className="form-control"
                        placeholder="Tell us about your requirements..."
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="col-12">
                    <button
                      type="submit"
                      className="premium-action-btn mt-0"
                      disabled={loading}
                    >
                      {loading ? "Sending Enquiry..." : "Send Message Now"}
                    </button>
                    {message && (
                      <div className="alert alert-success mt-3 py-2 border-0 rounded-3 small" role="alert">
                        ✨ {message}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
