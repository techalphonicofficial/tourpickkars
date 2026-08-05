import { decrypt, encrypt } from "@/functions/crypt";
import React, { useState, useEffect } from "react";

export default function Occupancy({
  selectedDate,
  activeCosts,
  selectedCosts,
  setSelectedCosts,
  slug,
}) {
  const bookingData = (() => {
    try {
      return JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    setSelectedCosts((prev) =>
      prev.map((i) => ({
        ...i,
        quantity: 0,
      }))
    );
  }, [selectedDate, setSelectedCosts]);

  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem(
        `enlive_${slug}`,
        encrypt(JSON.stringify({
          ...bookingData,
          package_id: selectedDate.package_id,
          start_date: selectedDate.start_date,
          end_date: selectedDate.end_date,
          active_cost: selectedCosts,
        }))
      );
    }
  }, [selectedCosts, selectedDate, slug]);

  const handleIncrease = (item) => {
    setSelectedCosts((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      const calculatePrice = (cost) => {
        const decrease = Number(selectedDate.decrease_amount_by_percent) || 0;
        const increase = Number(selectedDate.increase_amount_by_percent) || 0;
        let base = Number(cost);
        if (decrease > 0) base -= (base * decrease) / 100;
        if (increase > 0) base += (base * increase) / 100;
        return base;
      };

      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            cost: calculatePrice(item.total_with_discount),
            quantity: 1,
          },
        ];
      }
    });
  };

  const handleDecrease = (item) => {
    setSelectedCosts((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (!exists) return prev;
      if (exists.quantity === 1) {
        return prev.filter((i) => i.id !== item.id);
      }
      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const getQuantity = (id) => {
    const exists = selectedCosts.find((i) => i.id === id);
    return exists ? exists.quantity : 0;
  };

  if (!activeCosts || !selectedDate) return null;

  return (
    <div className="min_box-detail mb-4">
      <div className="mb-4">
        <div className="section-title-premium m-0 h3">Room Arrangement</div>
        <p className="text-muted small">Choose your preferred sharing option</p>
      </div>

      <div className="row g-3">
        {activeCosts.map((item) => {
          const decrease = Number(selectedDate.decrease_amount_by_percent) || 0;
          const increase = Number(selectedDate.increase_amount_by_percent) || 0;
          
          let finalPrice = Number(item.total_with_discount);
          let originalPrice = Number(item.cost);

          if (decrease > 0) {
            finalPrice -= (finalPrice * decrease) / 100;
            originalPrice -= (originalPrice * decrease) / 100;
          }
          if (increase > 0) {
            finalPrice += (finalPrice * increase) / 100;
          }

          return (
            <div key={item.id} className="col-12">
              <div className="occupancy-card-premium">
                <div className="d-flex flex-column">
                  <span className="fw-bold text-dark fs-5">{item.activity}</span>
                  <span className="text-muted small">Per Person</span>
                </div>

                <div className="d-flex align-items-center gap-4">
                  <div className="text-end">
                    <div className="text-muted text-decoration-line-through small">
                      ₹ {originalPrice.toFixed(0)}
                    </div>
                    <div className="fw-800 text-primary fs-4">
                      ₹ {finalPrice.toFixed(0)}
                    </div>
                  </div>

                  <div className="quantity-stepper-premium">
                    <button
                      className="stepper-btn"
                      onClick={() => handleDecrease(item)}
                      disabled={getQuantity(item.id) === 0}
                    >
                      −
                    </button>
                    <span className="stepper-value">{getQuantity(item.id)}</span>
                    <button
                      className="stepper-btn"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
