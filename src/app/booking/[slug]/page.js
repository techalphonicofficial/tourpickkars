"use client";
import AvailableDates from "@/components/Booking/AvailableDates";
import BillingDetail from "@/components/Booking/BillingDetail";
import Coupons from "@/components/Booking/Coupons";
import Occupancy from "@/components/Booking/Occupancy";
import PaymentType from "@/components/Booking/PaymentType";
import Pricing from "@/components/Booking/Pricing";
import TravellerDetail from "@/components/Booking/TravellerDetail";
import TripSummary from "@/components/Booking/TripSummary";
import { costs_and_dates } from "@/services/packageApi";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { razorpay } from "@/services/packageApi";
const razorpay_key = await razorpay();

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function BookingPage() {
  const params = useParams();
  const slug = params?.slug;
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [paybleType, setPaybleType] = useState("full");
  const [formCompleted, setFormCompleted] = useState(false);
  const [fullAmount, setFullAmount] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const res = await costs_and_dates(slug);
        setData(res);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [slug]);

  const groupedDates = useMemo(() => {
    if (!data || !data.packageDates) return [];
    const groups = data.packageDates.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const month = monthNames[date.getMonth()];

      if (!acc[month]) {
        acc[month] = { month, dates: [] };
      }
      acc[month].dates.push(item);
      return acc;
    }, {});

    const monthGroups = Object.values(groups);

    return [{ month: "All", dates: data.packageDates }, ...monthGroups];
  }, [data]);

  const handleSetDates = (id) => {
    // console.log("run handleSetDates");
    if (!data || !data.packageDates) return;
    const selectedDate = data.packageDates.filter((itm) => itm.id == id);
    setSelectedDate(selectedDate[0]);
    setSelectedCosts([]);
  };

  const [step, setStep] = useState(1);

  return (
    <div className="booking_page pt-5">
      <div className="container th-container">
        <div className="row mt-4">
          <div className="col-lg-8 mb-5">
            <div style={{ position: "sticky", top: "130px" }}>
              {step === 1 && (
                <>
                  <AvailableDates
                    groupedDates={groupedDates}
                    packageDates={data.packageDates}
                    handleSetDates={handleSetDates}
                    slug={slug}
                  />
                  <Occupancy
                    selectedDate={selectedDate}
                    activeCosts={data.activeCosts}
                    selectedCosts={selectedCosts}
                    setSelectedCosts={setSelectedCosts}
                    slug={slug}
                  />
                </>
              )}

              {/* Step 2: Billing Detail */}
              {step === 2 && (
                <BillingDetail
                  formCompleted={formCompleted}
                  setFormCompleted={setFormCompleted}
                  slug={slug}
                />
              )}

              {step === 3 && (
                <>
                  <TravellerDetail slug={slug} />
                  <TripSummary slug={slug} selectedDate={selectedDate} />
                  <PaymentType razorpay_key={razorpay_key} slug={slug} paybleType={paybleType} setPaybleType={setPaybleType} fullAmount={fullAmount} />
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 mb-5">
            <Pricing
              step={step}
              slug={slug}
              setStep={setStep}
              selectedCosts={selectedCosts}
              formCompleted={formCompleted}
              setFullAmount={setFullAmount}
              paybleType={paybleType}
              razorpay_key={razorpay_key}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
