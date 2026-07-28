import { notFound } from "next/navigation";
import { api } from "./config";

export async function trendingPackage() {
  try {
    const res = await api.get("/packages/trending");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}

export async function allPackage() {
  try {
    const res = await api.get("/packages");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}

export async function singlePackage(slug) {
  try {
    const res = await api.get(`/packages/single/${slug}`);
    // console.log("single package res", res.data);
    if (!res.data.hasOwnProperty("id")) {
      return notFound();
    }
    return res.data;
  } catch (error) {
    return notFound();
    throw new Error(error.response?.data?.message || "Failed to fetch Package");
  }
}
export async function packageRedirection(slug) {
  try {
    const res = await api.get(`/redirection/${slug}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}
export async function costs_and_dates(slug) {
  try {
    const res = await api.get(`packages/${slug}/costs-and-dates`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}

export async function searchPackages(search) {
  try {
    const res = await api.get(`packages/search/${search}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}
export async function razorpay() {
  try {
    const res = await api.get(`razorpay`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}
