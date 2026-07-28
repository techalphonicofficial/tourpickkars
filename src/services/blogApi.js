import { api } from "./config";
import { notFound } from "next/navigation";

// Get all blogs
export async function getBlogs(page = 1, perPage = 10) {
  try {
    const res = await api.get("/blogs", {
      params: { page, per_page: perPage },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}
export async function getBlogsByTripDestination(text) {
  try {
    const res = await api.get(`/blogs/search/${text}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
}
export async function getSingleBlog(slug) {
  try {
    const res = await api.get(`/blogs/${slug}`);
    // console.log("res blog", res);
    return res.data;
  } catch (error) {
    return notFound();
    // console.log(error.response?.data?.message)
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
}
