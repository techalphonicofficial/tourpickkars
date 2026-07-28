"use client";
import { api } from "@/services/config";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faUsers,
  faCalendarAlt,
  faClock,
  faPlane,
  faMapMarkedAlt,
  faCommentDots
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tripsWithPackagecount } from "@/services/tripsApi";

export default function CustomTripForm() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [tripType, setTripType] = useState("");
  const [tripsData, setTripsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const tripsWithcount = await tripsWithPackagecount();
        // console.log("tripsWithcount", tripsWithcount);
        if (Array.isArray(tripsWithcount)) {
          setTripsData(tripsWithcount);
        } else if (tripsWithcount?.data && Array.isArray(tripsWithcount.data)) {
          setTripsData(tripsWithcount.data);
        } else {
          setTripsData(tripsWithcount || []);
        }
      } catch (error) {
        console.error("Failed to fetch trips count:", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const finalPayload = {
        ...payload,
        trip_type: tripType,
        departure_date: startDate ? startDate.toISOString().split("T")[0] : payload.departure_date,
      };

      // console.log("Custom Trip Form Payload:", finalPayload);

      const res = await api.post("/trip-requests", finalPayload);

      if (res.data.success == true) {
        setMessage("Your custom trip request has been successfully submitted! Our team will contact you soon.");
        formRef.current.reset();
        setStartDate(null);
      } else {
        setMessage(res.data.message || "Request submitted successfully.");
        formRef.current.reset();
        setStartDate(null);
      }
    } catch (error) {
      console.log(error?.response?.data || error);
      setMessage(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="premium-contact-form-box mt-5 mx-auto position-relative"
      style={{
        maxWidth: '850px',
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 186, 157, 0.08)',
        border: '1px solid rgba(0,0,0,0.03)'
      }}
    >
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '50px', right: '-25px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#00ba9d', opacity: 0.1 }}></div>
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#00ba9d', opacity: 0.05 }}></div>

      <form ref={formRef} onSubmit={handleSubmit} className="ajax-contact position-relative z-1">
        <div className="text-center mb-5">
          <span className="badge bg-light text-theme px-3 py-2 rounded-pill mb-2 fw-semibold" style={{ color: '#00ba9d', position: 'inherit' }}>Craft Your Journey</span>
          <h3 className="fw-bolder text-capitalize m-0 mt-2 display-6" style={{ color: '#2c3e50', letterSpacing: '-0.5px' }}>Plan Your Custom Trip</h3>
          <p className="text-muted mt-3 fs-5" style={{ maxWidth: '600px', margin: '0 auto' }}>Tell us your preferences and let our experts design the perfect itinerary just for you.</p>
        </div>

        <div className="row g-4 pt-2">
          {/* Full Name */}
          <div className="col-12">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Full Name</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ transition: 'all 0.3s ease', backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input type="text" className="form-control border-0 py-3 px-2 fs-6 rounded-end-4" name="name" placeholder="John Doe" required style={{ boxShadow: 'none' }} />
            </div>
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Email Address</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input type="email" className="form-control border-0 py-3 px-2 fs-6 rounded-end-4" name="email" placeholder="john@example.com" required style={{ boxShadow: 'none' }} />
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Phone Number</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <input type="tel" className="form-control border-0 py-3 px-2 fs-6 rounded-end-4" name="phone" placeholder="+91 9679945077" required pattern="\d{10,12}" style={{ boxShadow: 'none' }} />
            </div>
          </div>

          {/* Number of Travellers */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Travellers</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faUsers} />
              </span>
              <input type="number" className="form-control border-0 py-3 px-2 fs-6 rounded-end-4" name="travellers" placeholder="No. of Travellers" required min="1" style={{ boxShadow: 'none' }} />
            </div>
          </div>

          {/* Departure Date */}
          <div className="col-md-6" style={{ position: 'relative', zIndex: 10 }}>
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Departure Date</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff', flexWrap: 'nowrap' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                placeholderText="DD / MM / YYYY"
                className="form-control border-0 py-3 px-2 fs-6 text-muted rounded-end-4"
                name="departure_date"
                required
                style={{ boxShadow: 'none', width: '100%' }}
                wrapperClassName="d-flex flex-grow-1"
              />
            </div>

            <style jsx global>{`
              .react-datepicker-wrapper {
                width: 100%;
                display: flex;
              }
              .react-datepicker__input-container {
                width: 100%;
                display: flex;
              }
              .react-datepicker__input-container input {
                width: 100%;
              }
              .react-datepicker {
                font-family: inherit;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
              }
              .react-datepicker__header {
                background-color: #f8f9fa;
                border-bottom: 1px solid #e2e8f0;
                border-top-left-radius: 12px !important;
                border-top-right-radius: 12px !important;
                padding-top: 15px;
              }
              .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range {
                background-color: #00ba9d !important;
                border-radius: 8px;
              }
              .react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover {
                background-color: #e9f9ee;
                border-radius: 8px;
              }
              .react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected {
                background-color: #00ba9d;
                color: #fff;
                border-radius: 8px;
              }
            `}</style>
          </div>



          {/* Trip Type Dropdown */}
          <div className="col-md-6 mb-2">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Trip Type</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faPlane} />
              </span>
              <select
                className="form-select border-0  px-2 fs-6 text-muted rounded-end-4"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                required
                style={{ boxShadow: 'none', cursor: 'pointer' }}
              >
                <option value="" disabled>Select Type (Domestic/International)</option>
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>

          {/* Packages Dropdown */}
          <div className="col-md-6 mb-2">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Select Package</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faMapMarkedAlt} />
              </span>
              <select
                name="selected_package"
                className="form-select border-0  px-2 fs-6 text-muted rounded-end-4"
                defaultValue=""
                required
                style={{ boxShadow: 'none', cursor: 'pointer' }}
              >
                <option value="" disabled>Select a preferred package</option>
                {(Array.isArray(tripsData) ? tripsData : [])
                  .filter(t => !tripType || (tripType === "Domestic" ? t.international == 0 : t.international == 1))
                  .map((trip, idx) => (
                    <option key={trip.id || idx} value={trip.heading || trip.title || trip.name || `Package ${idx}`}>
                      {trip.heading || trip.title || trip.name || `Package ${idx}`}
                    </option>
                  ))
                }
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Duration Dropdown */}
          <div className="col-12 mb-2">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Trip Duration</label>
            <div className="input-group input-group-lg shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faClock} />
              </span>
              <select name="duration" className="form-select border-0 py-1 px-2 fs-6 text-muted rounded-end-4" defaultValue="" required style={{ boxShadow: 'none', cursor: 'pointer' }}>
                <option value="" disabled>Select how many days you want to travel</option>
                <option value="2N-3D">2 Nights - 3 Days</option>
                <option value="3N-4D">3 Nights - 4 Days</option>
                <option value="4N-5D">4 Nights - 5 Days</option>
                <option value="5N-6D">5 Nights - 6 Days</option>
                <option value="6N-7D">6 Nights - 7 Days</option>
                <option value="7N-8D">7 Nights - 8 Days</option>
                <option value="8N-9D">8 Nights - 9 Days</option>
                <option value="9N-10D">9 Nights - 10 Days</option>
                <option value="More">More</option>
              </select>
            </div>
          </div>

          {/* Additional Message */}
          <div className="col-12 mb-2">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Additional Message</label>
            <div className="input-group shadow-sm rounded-4 border" style={{ backgroundColor: '#fff' }}>
              <span className="input-group-text bg-white border-0 px-4 rounded-start-4 pt-4 align-items-start" style={{ color: '#00ba9d' }}>
                <FontAwesomeIcon icon={faCommentDots} />
              </span>
              <textarea
                name="user_message"
                className="form-control border-0 py-3 px-2 fs-6 text-muted rounded-end-4"
                rows="3"
                placeholder="Tell us about special requirements or preferences..."
                style={{ boxShadow: 'none', resize: 'vertical' }}
              ></textarea>
            </div>
          </div>



          {/* Submit */}
          <div className="col-12 mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-bold shadow-lg"
              style={{ backgroundColor: '#00ba9d', border: 'none', fontSize: '1.1rem', letterSpacing: '0.5px', transition: 'all 0.3s ease' }}
              disabled={loading}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Submitting Request...
                </span>
              ) : "Send Custom Trip Request"}
            </button>
            <div className="mt-3 small text-muted">
              We'll get back to you within 24 hours with a custom itinerary.
            </div>

            {message && (
              <div className="alert alert-success mt-4 py-3 border-0 shadow-sm rounded-4 text-center fw-medium d-flex align-items-center justify-content-center gap-2" role="alert" style={{ backgroundColor: '#e9f9ee', color: '#0ab37b' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {message}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
