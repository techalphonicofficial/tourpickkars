

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
    console.error(`Error fetching page ${pageId} (section: ${sectionKey}): ${error.message}`);
    console.error(`Base URL: ${api.defaults.baseURL}`);
    // Do not throw so build doesn't crash on _not-found page rendering
    return { sections: [] }; // Fallback
  }
}

