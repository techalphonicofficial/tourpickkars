import Link from "next/link";
import CustomTripForm from "@/components/CustomTrips/CustomTripForm";

export const metadata = {
    title: "Custom Trips | Tour Pickkars",
    description: "Plan your personalized and custom trips with Tour Pickkars.",
};

export default function CustomTripsPage() {
    return (
        <>
            {/* Hero Section */}
            <div
                className="breadcumb-wrapper rounded-bottom-5"
                style={{
                    backgroundImage: "url('/img/bg/custom-trips.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "450px",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    backgroundColor: "#1a1a1a" // Fallback color
                }}
            >
                <div className="absolute inset-0 bg-dark opacity-50" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }}></div>
                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <div className="breadcumb-content text-center">
                        <span className="badge bg-theme-soft text-theme rounded-pill px-4 py-2 mb-3 fw-bold mt-5" style={{ letterSpacing: '2px', backgroundColor: '#e9f9ee', color: '#00ba9d', position: 'inherit' }}>
                            TAILOR-MADE JOURNEYS
                        </span>
                        <h1 className="breadcumb-title text-white fw-800 display-3 mb-4">Plan Custom Trip</h1>
                        <ul className="breadcumb-menu justify-content-center d-flex gap-3 list-unstyled">
                            <li>
                                <Link href="/" className="text-white opacity-75 text-decoration-none">Home</Link>
                            </li>
                            <li className="text-white">Custom Trips</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space bg-light form-bg position-relative z-index-common pb-5">
                <div className="container pb-5">
                    <div className="row justify-content-center" style={{ marginTop: "-80px" }}>
                        <div className="col-xl-8 col-lg-10">
                            <CustomTripForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
