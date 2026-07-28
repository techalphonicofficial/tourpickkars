"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Trips() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  // Dummy JSON data
  const dummyTrips = [
    {
      id: 1,
      title: "Beach Paradise",
      description: "Enjoy the sunny beaches and relax with ocean views.",
      image: "https://picsum.photos/400/200?random=1",
    },
    {
      id: 2,
      title: "Mountain Adventure",
      description: "Explore the mountains with guided treks and camping.",
      image: "https://picsum.photos/400/200?random=2",
    },
    {
      id: 3,
      title: "City Lights",
      description: "Discover the nightlife and culture of vibrant cities.",
      image: "https://picsum.photos/400/200?random=3",
    },
    {
      id: 4,
      title: "Desert Safari",
      description: "Ride the dunes and enjoy traditional desert evenings.",
      image: "https://picsum.photos/400/200?random=4",
    },
    {
      id: 5,
      title: "Historical Wonders",
      description: "Step into history with world heritage site tours.",
      image: "https://picsum.photos/400/200?random=5",
    },
  ];

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setTrips(dummyTrips);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 text-center">Available Trips</h2>

      {loading ? (
        <div className="text-center py-5">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-5">No trips found.</div>
      ) : (
        <>
          {/* Swiper for mobile (xs only) */}
          <div className="mt-4 px-3 d-sm-none">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
            >
              {/* {trips.map((trip) => (
                <SwiperSlide key={trip.id}>
                  <CardTrip trip={trip} />
                </SwiperSlide>
              ))} */}
            </Swiper>
          </div>

          {/* Grid for sm and above */}
          <div className="d-none d-sm-block mt-4">
            <div className="row g-4">
              {trips.map((trip) => (
                <div key={trip.id} className="col-6 col-md-6 col-lg-4 col-xl-3">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={trip.image}
                      className="card-img-top"
                      alt={trip.title}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{trip.title}</h5>
                      <p className="card-text text-muted">{trip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
