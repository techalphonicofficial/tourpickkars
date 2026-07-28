

import { api } from "./config";

// Get all blogs
// export async function getPagewithSection(pageId, sectionKey = false) {
//   try {
//     console.log(`Fetching page ${pageId} from: ${api.defaults.baseURL}`);
//     const res = await api.get(sectionKey ? `pages/${pageId}/${sectionKey}` : `pages/${pageId}`);
//     console.log(`Successfully fetched page ${pageId}`);
//     console.log(res.data);
//     return res.data;
//   } catch (error) {
//     console.error('Error fetching page:', {
//       pageId,
//       sectionKey,
//       errorMessage: error.message,
//       responseStatus: error.response?.status,
//       responseData: error.response?.data,
//       apiUrl: api.defaults.baseURL
//     });
//     throw new Error(error.response?.data?.message || "Failed to fetch page data");
//   }
// }


export async function getPagewithSection(pageId, sectionKey = false) {
  try {
    const url = sectionKey
      ? `pages/${pageId}/${sectionKey}`
      : `pages/${pageId}`;

    const res = await api.get(url);
    return res.data;

  } catch (error) {
    console.error("Error fetching page:", {
      pageId,
      sectionKey,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      baseURL: api.defaults.baseURL,
    });

    // Better error handling
    if (error.response) {
      throw new Error(error.response.data?.message || "API Error");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Request setup error");
    }
  }
}

