"use client";
import { allPackage } from "@/services/packageApi";
import TourCard from "../PopularTour/TourCard";
import DateMonthSlider from "@/components/HelpingCompnents/DateMonthSlider";
import { api } from "@/services/config";
import { useEffect, useMemo, useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";
const packages = await allPackage();

export default function UpcomingTripSection({ byCategory, resetKey, setHasDateFilter }) {
  const [allPkg, setPackages] = useState([...packages]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Reset date filter state when resetKey changes
    setPackages([...packages]);
    if (setHasDateFilter) {
      setHasDateFilter(false);
    }
  }, [resetKey, setHasDateFilter]);

  const groupedDates = useMemo(() => {
    if (packages.length === 0) return [];

    let allDates = [];
    allPkg.forEach((pkg) => {
      pkg.package_dates.forEach((d) => {
        allDates.push(d);
      });
    });

    const uniqueDates = Object.values(
      allDates.reduce((acc, item) => {
        acc[item.start_date] = item;
        return acc;
      }, {})
    );

    // Group by Month-Year
    const grouped = uniqueDates.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const monthYear =
        date.toLocaleString("en-US", { month: "short" }) +
        "-" +
        date.getFullYear().toString().slice(-2);

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }

      acc[monthYear].push({
        date: date.getDate(),
        day: date.toLocaleString("en-US", { weekday: "short" }),
        full_date: item.start_date,
      });

      return acc;
    }, {});

    return Object.entries(grouped).map(([month, days]) => ({
      label: month,
      days,
    }));
  }, []);

  const handleDateFilter = (date) => {
    const dateFilter = packages.filter((pkg) =>
      pkg.package_dates.some((d) => d.start_date == date)
    );
    // console.log(dateFilter);
    setPackages([...dateFilter]);
    if (setHasDateFilter) {
      setHasDateFilter(true);
    }
  };

  return (
    <section
      className="tour-area position-relative bg-top-center overflow-hidden"
      id="service-sec"
    >
      <div className="slider-area tour-slider">
        <div className="container th-container mb-5">
          {groupedDates.length != 0 && (
            <DateMonthSlider
              key={`slider-reset-${resetKey}`}
              handleDateFilter={handleDateFilter}
              monthsData={groupedDates}
            />
          )}
          {allPkg.length === 0 ? (
            <div className="text-center py-5">No trips found.</div>
          ) : (
            <div className="mt-4">
              <div className="row g-4">
                {allPkg
                  .filter((it) => {
                    if (byCategory == "all") {
                      return true;
                    }
                    return it.trip_id == byCategory;
                  })
                  .map((tour) => (
                    <div key={tour.id} className="col-xxl-4 col-lg-6">
                      <TourCard
                        data={tour}
                        onRequestCallback={(data) => setOpen(data)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        {/* Modal */}
        {open && <RequestCallback open={open} setOpen={setOpen} />}
      </div>
    </section>
  );
}
