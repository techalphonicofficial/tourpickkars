import { api, apiEndpoint } from "./config";

// Fetch booking details by ID
export async function getBookingDetail(id) {
  try {
    const res = await api.get("/booking/get-booking", {
      params: { id: id },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch booking details"
    );
  }
}

export async function submitBookingDetail(formData) {
  try {
    const formDataEntries = [];
    for (let pair of formData.entries()) {
      if (pair[0].includes('proof') && pair[1] instanceof File) {
        formDataEntries.push({
          field: pair[0],
          type: 'File',
          name: pair[1].name,
          size: pair[1].size,
          mimeType: pair[1].type
        });
      } else {
        formDataEntries.push({
          field: pair[0],
          value: pair[1].substring ? pair[1].substring(0, 200) : pair[1]
        });
      }
    }

    const res = await fetch(apiEndpoint("/booking/booking-information"), {
      method: "POST",
      body: formData,
    });


    const responseText = await res.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!res.ok) {
      throw new Error(responseData.message || `HTTP error! Status: ${res.status}`);
    }

    return responseData;

  } catch (error) {
    console.error("Booking submission error:", error);
    throw error;
  }
}
