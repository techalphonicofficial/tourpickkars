// import { api } from "@/services/config";
// import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useMemo, useEffect, useState } from "react";
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { decrypt, encrypt } from "@/functions/crypt";

// export default function Pricing({
//   step,
//   setStep,
//   selectedCosts,
//   formCompleted,
//   setFullAmount,
//   paybleType,
//   slug,
//   razorpay_key,
// }) {
//   const router = useRouter();

//   const bookingData = (() => {
//     try {
//       return JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
//     } catch {
//       return {};
//     }
//   })();

//   const getButtonLabel = () => {
//     if (step === 1) return "Proceed to Traveller Details";
//     if (step === 2) return "Proceed to Billing";
//     if (step === 3) return "Make a Trip";
//   };

//   const totals = useMemo(() => {
//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalAfterDiscount = 0;
//     let totalGst = 0;
//     let grandTotal = 0;

//     selectedCosts.forEach((item) => {
//       const qty = item.quantity;
//       const cost = item.cost;

//       const itemSubtotal = cost * qty;
//       const itemDiscount =
//         cost * (parseFloat(item.discount_percent) / 100) * qty;
//       const itemAfterDiscount = itemSubtotal - itemDiscount;
//       const itemGst = itemAfterDiscount * (parseFloat(item.gst_percent) / 100);
//       const itemGrand = itemAfterDiscount + itemGst;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalAfterDiscount += itemAfterDiscount;
//       totalGst += itemGst;
//       grandTotal += itemGrand;
//     });
//     return {
//       subtotal,
//       totalDiscount,
//       totalAfterDiscount,
//       totalGst,
//       grandTotal,
//     };
//   }, [selectedCosts]);

//   useEffect(() => {
//     setFullAmount(totals.grandTotal);
//   }, [totals.grandTotal, setFullAmount]);

//   const handleClick = () => {
//     if (step < 3) {
//       if (selectedCosts.length > 0) {
//         setStep(2);
//         if (formCompleted) {
//           setStep(3);
//         }
//       }
//     } else {
//       localStorage.setItem(
//         `enlive_${slug}`,
//         encrypt(
//         JSON.stringify({
//           ...bookingData,
//           final_amount: Number(totals.grandTotal.toFixed(0)),
//           paid_amount:
//             paybleType == "full"
//               ? Number(totals.grandTotal.toFixed(0))
//               : Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 ),
//           due_amount:
//             paybleType != "full"
//               ? Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 )
//               : 0,
//         })
//         )
//       );
//       openRazorpay();
//     }
//   };
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const openRazorpay = () => {
//     const weblogo = document.querySelector(".header-top").dataset.weblogo;
//     const options = {
//       key: razorpay_key.razorpay_key_id,
//       amount:
//         (paybleType == "full"
//           ? totals.grandTotal.toFixed(0)
//           : (
//               (totals.grandTotal * razorpay_key.package_amount_percent) /
//               100
//             ).toFixed(0)) * 100,
//       currency: "INR",
//       name: "Enlive Trips",
//       image: weblogo,
//       handler: async (response) => {
//         const payload =
//           JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
//         try {
//           const res = await api.post("/booking/add-booking", {
//             ...payload,
//             ...response,
//           });
//           console.log("booking response", res)

//           if (res.data.success === true) {
//             console.log(JSON.stringify(res.data));
//             localStorage.removeItem(`enlive_${slug}`);  
//             router.push("/thankyou");
//           }
//         } catch (error) {
//           if (error.response) {
//             console.error("Server Error:", error.response.data);
//             // setMessage(error.response.data.message || "Something went wrong");
//           } else if (error.request) {
//             console.error("No response from server:", error.request);
//             // setMessage("No response from server, please try again.");
//           } else {
//             console.error("Error:", error.message);
//             // setMessage(error.message || "Unexpected error occurred");
//           }
//         } finally {
//           // setLoading(false);
//         }
//       },
//       prefill: {
//         name: bookingData.ful_name,
//         email: bookingData.email,
//         contact: bookingData.phone,
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };
//   return (
//     <div className="min_box-detail Age_limit book_Amount container my-4">
//       <div className="title d-flex justify-content-between gap-5">
//         <div className="text-start flex-wrap fw-bold mb-4 page-title h6">
//           Amount to Pay{" "}
//           {paybleType == "full" ? (
//             <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//           ) : (
//             <span>
//               ₹
//               {(
//                 (totals.grandTotal * razorpay_key.package_amount_percent) /
//                 100
//               ).toFixed(0)}
//               /-
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="pricing_box">
//         <div className="pricong-table">
//           <div className="table-responsive">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Room sharing</th>
//                   <th>Selling Cost (Per Person)</th>
//                   <th>Discounted Cost (Per Person)</th>
//                   <th>Qty.</th>
//                   <th>Cost</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedCosts.map((costs) => (
//                   <tr key={costs.id}>
//                     <td>{costs.activity}</td>
//                     <td className="text-decoration-line-through">
//                       ₹{costs.cost.toFixed(0)}/-
//                     </td>
//                     <td>
//                       ₹
//                       {costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100}
//                       /-
//                     </td>
//                     <td>{costs.quantity}</td>
//                     <td>
//                       ₹
//                       {(costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100) *
//                         costs.quantity}
//                       /-
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pring_data">
//             <ul className="list-unstyled">
//               <li className="d-flex justify-content-between">
//                 Subtotal <span>₹{totals.subtotal.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 GST (5%)<span>₹{totals.totalGst.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 Discount{" "}
//                 <span className="text-decoration-line-through">
//                   ₹{totals.totalDiscount.toFixed(0)}
//                 </span>
//               </li>
//               <hr />
//               {paybleType == "full" ? (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   Full Amount To Pay{" "}
//                   <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//                 </li>
//               ) : (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   {razorpay_key.package_amount_percent}% Amount To Pay{" "}
//                   <span>
//                     ₹
//                     {(
//                       (totals.grandTotal *
//                         razorpay_key.package_amount_percent) /
//                       100
//                     ).toFixed(0)}
//                     /-
//                   </span>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Step Buttons */}
//           <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
//             {/* Back Button only if not in Step 1 */}
//             {step > 1 && (
//               <button
//                 className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
//                 onClick={() => setStep(step - 1)}
//               >
//                 <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
//               </button>
//             )}

//             <button
//               className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
//               onClick={handleClick}
//             >
//               {getButtonLabel()}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { api } from "@/services/config";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { decrypt, encrypt } from "@/functions/crypt";

export default function Pricing({
  step,
  setStep,
  selectedCosts,
  formCompleted,
  setFullAmount,
  paybleType,
  slug,
  razorpay_key,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const bookingData = (() => {
    try {
      return JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
    } catch {
      return {};
    }
  })();

  const getButtonLabel = () => {
    if (isLoading) return "Processing..."; // Show loading text
    if (step === 1) return "Proceed to Traveller Details";
    if (step === 2) return "Proceed to Billing";
    if (step === 3) return "Make a Trip";
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalAfterDiscount = 0;
    let totalGst = 0;
    let grandTotal = 0;

    selectedCosts.forEach((item) => {
      const qty = item.quantity;
      const cost = item.cost;

      const itemSubtotal = cost * qty;
      const itemDiscount =
        cost * (parseFloat(item.discount_percent) / 100) * qty;
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      const itemGst = itemAfterDiscount * (parseFloat(item.gst_percent) / 100);
      const itemGrand = itemAfterDiscount + itemGst;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalAfterDiscount += itemAfterDiscount;
      totalGst += itemGst;
      grandTotal += itemGrand;
    });
    return {
      subtotal,
      totalDiscount,
      totalAfterDiscount,
      totalGst,
      grandTotal,
    };
  }, [selectedCosts]);

  useEffect(() => {
    setFullAmount(totals.grandTotal);
  }, [totals.grandTotal, setFullAmount]);

  const handleClick = () => {
    if (step < 3) {
      if (selectedCosts.length > 0) {
        setStep(2);
        if (formCompleted) {
          setStep(3);
        }
      }
    } else {
      setIsLoading(true); // Start loading
      localStorage.setItem(
        `enlive_${slug}`,
        encrypt(
          JSON.stringify({
            ...bookingData,
            final_amount: Number(totals.grandTotal.toFixed(0)),
            paid_amount:
              paybleType == "full"
                ? Number(totals.grandTotal.toFixed(0))
                : Number(
                  (
                    (totals.grandTotal * razorpay_key.package_amount_percent) /
                    100
                  ).toFixed(0)
                ),
            due_amount:
              paybleType != "full"
                ? Number(
                  (
                    (totals.grandTotal * razorpay_key.package_amount_percent) /
                    100
                  ).toFixed(0)
                )
                : 0,
          })
        )
      );
      openRazorpay();
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openRazorpay = () => {
    const weblogo = document.querySelector(".header-top")?.dataset?.weblogo || '';

    const options = {
      key: razorpay_key.razorpay_key_id,
      amount:
        (paybleType == "full"
          ? totals.grandTotal.toFixed(0)
          : (
            (totals.grandTotal * razorpay_key.package_amount_percent) /
            100
          ).toFixed(0)) * 100,
      currency: "INR",
      name: "Enlive Trips",
      image: weblogo,
      handler: async (response) => {
        const payload =
          JSON.parse(decrypt(localStorage.getItem(`enlive_${slug}`))) || {};
        try {
          const res = await api.post("/booking/add-booking", {
            ...payload,
            ...response,
          });
          // console.log("booking response", res)

          if (res.data.success === true) {
            // console.log(JSON.stringify(res.data));
            localStorage.removeItem(`enlive_${slug}`);
            router.push("/thankyou");
          }
        } catch (error) {
          if (error.response) {
            console.error("Server Error:", error.response.data);
            // Show error message to user
            alert(error.response.data.message || "Something went wrong");
          } else if (error.request) {
            console.error("No response from server:", error.request);
            alert("No response from server, please try again.");
          } else {
            console.error("Error:", error.message);
            alert(error.message || "Unexpected error occurred");
          }
        } finally {
          setIsLoading(false); // Stop loading
        }
      },
      modal: {
        ondismiss: () => {
          // This function is called when the user closes the Razorpay modal
          // console.log("Payment modal closed by user");
          setIsLoading(false); // Remove loading state on cancel

          // Optional: Show a message to user
          alert("Payment cancelled. You can try again when you're ready.");
        },
      },
      prefill: {
        name: bookingData.ful_name || '',
        email: bookingData.email || '',
        contact: bookingData.phone || '',
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);

    // Handle case where Razorpay fails to open
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      setIsLoading(false); // Remove loading state on payment failure
      alert('Payment failed: ' + (response.error.description || 'Please try again'));
    });

    rzp.open();
  };

  // Handle Razorpay modal close (alternative method)
  useEffect(() => {
    const handleRazorpayClose = () => {
      // Check if there's an active Razorpay instance and modal is closed
      // This is a fallback in case the modal.ondismiss doesn't work
      setTimeout(() => {
        // Check if Razorpay modal is not visible
        const razorpayModal = document.querySelector('.razorpay-container');
        if (!razorpayModal || razorpayModal.style.display === 'none') {
          setIsLoading(false);
        }
      }, 500);
    };

    window.addEventListener('popstate', handleRazorpayClose);
    window.addEventListener('blur', handleRazorpayClose);

    return () => {
      window.removeEventListener('popstate', handleRazorpayClose);
      window.removeEventListener('blur', handleRazorpayClose);
    };
  }, []);

  return (
    <div className="pricing-sidebar-premium">
      <div className="mb-4 text-center">
        <div className="fw-bold mb-1 h4">Booking Summary</div>
        <div className="d-flex justify-content-center gap-2 mt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`step-dot ${step >= s ? "active" : ""}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: step >= s ? 'var(--theme-color)' : 'rgba(255,255,255,0.2)'
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="pricing-details-container mb-4">
        {selectedCosts.length > 0 ? (
          <>
            <div className="selected-items-list mb-3">
              {selectedCosts.map((item) => (
                <div key={item.id} className="pricing-row small">
                  <span className="text-light-50">
                    {item.activity} x {item.quantity}
                  </span>
                  <span>₹ {((item.cost - (item.cost * item.discount_percent / 100)) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="pricing-summary-card p-3 rounded-4 bg-white bg-opacity-10">
              <div className="pricing-row">
                <span className="text-light-50">Subtotal</span>
                <span>₹ {totals.subtotal.toFixed(0)}</span>
              </div>
              <div className="pricing-row">
                <span className="text-light-50 text-wrap">GST ({selectedCosts[0]?.gst_percent}%)</span>
                <span>₹ {totals.totalGst.toFixed(0)}</span>
              </div>
              <div className="pricing-row">
                <span className="text-light-50">Discount</span>
                <span className="text-danger">- ₹ {totals.totalDiscount.toFixed(0)}</span>
              </div>

              <div className="pricing-row total mt-2 border-top border-white border-opacity-10 pt-3">
                <span className="fw-bold fs-5">Total Amount</span>
                <div className="text-end">
                  <div className="pricing-total-value">₹ {totals.grandTotal.toFixed(0)}</div>
                  <div className="text-white xx-small" style={{ fontSize: '10px' }}>Incl. all taxes</div>
                </div>
              </div>
            </div>

            {paybleType !== "full" && (
              <div className="mt-3 p-3 rounded-4 border border-theme border-opacity-25 bg-theme bg-opacity-10">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-semibold text-white ">Advance to Pay Now</span>
                  <span className="fs-5 fw-800 text-white ">
                    ₹ {((totals.grandTotal * razorpay_key.package_amount_percent) / 100).toFixed(0)}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5 opacity-50">
            <div className="fs-1 mb-2">🛒</div>
            <p className="small">Please select a batch and room sharing option to continue</p>
          </div>
        )}
      </div>

      <div className="d-flex flex-column gap-3">
        <button
          className="premium-action-btn"
          onClick={handleClick}
          disabled={isLoading || selectedCosts.length === 0}
        >
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status"></div>
          ) : (
            getButtonLabel()
          )}
        </button>

        {step > 1 && (
          <button
            className="btn btn-link text-white text-decoration-none opacity-50 hover-opacity-100"
            onClick={() => setStep(step - 1)}
            disabled={isLoading}
          >
            ← Back to Previous Step
          </button>
        )}
      </div>

      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div className="text-center text-white">
            <div className="spinner-grow text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            <div className="fw-bold h4">Securing Your Trip...</div>
            <p className="opacity-75">Please complete the payment to confirm your booking</p>
          </div>
        </div>
      )}
    </div>
  );
}