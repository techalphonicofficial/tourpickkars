import { notFound } from "next/navigation";
import { api, apiEndpoint } from "./config";

export async function allTrips() {
  try {
    const res = await api.get(`/trips`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
}
export async function homeTrips() {
  try {
    const res = await api.get(`/trips/home`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
}
export async function singleTrips(slug) {
  try {
    const res = await api.get(`/trips/single/${slug}`);
    return res.data;
  } catch (error) {
    return notFound();
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
}

export async function tripsWithPackagecount() {
  try {
    const res = await fetch(apiEndpoint("/trips/trips-with-packagecount"), {
      next: { revalidate: 60 }
    });
    if (!res.ok) return []; // Fallback empty data during build failure
    return await res.json();
  } catch (error) {
    console.error("tripsWithPackagecount error:", error);
    return []; // Return empty array instead of throwing to prevent build crash
  }
}

export async function tripsWithDestination() {
  try {
    const res = await api.get(`/trips/trips-with-destination`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
}
