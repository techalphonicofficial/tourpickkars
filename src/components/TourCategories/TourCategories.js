// import { getPagewithSection } from "@/services/pageSection";
// import CurveSlider from "./CurveSlider";
// import { homeTrips } from "@/services/tripsApi";
// import "./TourCategories.css";

// export default async function TourCategories() {
//   const mainpage = await getPagewithSection(1, "categories");
//   const trips = await homeTrips();
//   console.log("homeTrips", trips);

//   return (
//     <section
//       className="category-area bg-top-center pt-8 pb-4"
//       style={{ backgroundImage: "url(/img/bg/category_bg_1.png)" }}
//     >
//       <div className="container th-container">
//         <div className="title-area text-center">
//           <span className="sub-title">
//             {mainpage.section[0].data.Text}
//           </span>
//           <div className="sec-title h2">{mainpage.section[1].data.Text}</div>
//         </div>

//         <CurveSlider trips={trips} />
//         <CurveSlider trips={trips} />


//         <div className="slider-pagination mt-6 text-center"></div>
//       </div>
//     </section>
//   );
// }





import { getPagewithSection } from "@/services/pageSection";
import CurveSlider from "./CurveSlider";
import { homeTrips } from "@/services/tripsApi";
import "./TourCategories.css";

export default async function TourCategories() {
  const mainpage = await getPagewithSection(1, "categories");
  const trips = await homeTrips();

  // ✅ Filter trips
  const internationalTrips = trips.filter(
    (trip) => Number(trip.is_international) === 1
  );

  const nationalTrips = trips.filter(
    (trip) => Number(trip.is_international) === 0
  );

  return (
    <section
      className="category-area bg-top-center pt-8 pb-4"
      style={{ backgroundImage: "url(/img/bg/category_bg_1.png)" }}
    >
      <div className="container th-container">
        
        {/* Title */}
        <div className="title-area text-center">
          <span className="sub-title">
            {mainpage.section[0].data.Text}
          </span>
          <div className="sec-title h2">
            {mainpage.section[1].data.Text}
          </div>
        </div>

        {/* 🌍 International Trips */}
        {internationalTrips.length > 0 && (
          <>
            <div className="text-center mt-4 mb-3 h3">
              International Trips
            </div>
            <CurveSlider trips={internationalTrips} />
          </>
        )}

        {/* 🇮🇳 National Trips */}
        {nationalTrips.length > 0 && (
          <>
            <div className="text-center mt-5 mb-3 h3">
              Domestic Trips
            </div>
            <CurveSlider trips={nationalTrips} />
          </>
        )}

        <div className="slider-pagination mt-6 text-center"></div>
      </div>
    </section>
  );
}