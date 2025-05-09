
export const API_BASE_URL = 'https://travel-management-qsnqa.ondigitalocean.app';

export const API_ENDPOINTS = {
  // Seller endpoints
  CREATE_SELLER: `${API_BASE_URL}/api/create-seller`,
  GET_ALL_SELLERS: `${API_BASE_URL}/api/get-all-sellers`,
  GET_SELLER_DETAIL: (id) => `${API_BASE_URL}/api/get-detail-seller/${id}`,
  DELETE_SELLER: (id) => `${API_BASE_URL}/api/delete-seller/${id}`,
  UPDATE_SELLER: (id) => `${API_BASE_URL}/api/update-seller/${id}`,
  CHANGE_PASSWORD: (id) => `${API_BASE_URL}/api/change-password/${id}`,

  // Booking endpoints
  CREATE_BOOKING: `${API_BASE_URL}/api/create-booking`,
  GET_ALL_BOOKINGS: `${API_BASE_URL}/api/get-all-bookings`,
  GET_ALL_BOOKINGS_BY_SELLER: (id) => `${API_BASE_URL}/api/get-booking-by-seller/${id}`,
  GET_BOOKING_DETAIL: (id) => `${API_BASE_URL}/api/get-booking/${id}`,
  UPDATE_BOOKING: (id) => `${API_BASE_URL}/api/update-booking/${id}`,
  DELETE_BOOKING: (id) => `${API_BASE_URL}/api/delete-booking/${id}`,

  // Export endpoints
  EXPORT_BOOKING_PDF: (id) => `${API_BASE_URL}/api/bookings/${id}/export`,
  EXPORT_BOOKING_TXT: (id) => `${API_BASE_URL}/api/bookings/${id}/export-txt`,
  EXPORT_BOOKING_IMG: (id) => `${API_BASE_URL}/api/bookings/${id}/export-image?format=jpg`,

  //Dashboard endpoints
  GET_DASHBOARD: `${API_BASE_URL}/api/get-dashboard`,
  GET_DASHBOARD_BY_SELLER: (id) => `${API_BASE_URL}/api/get-seller-dashboard/${id}`,
  GET_REVENUE_BY_SELLER: (month, year) => `${API_BASE_URL}/api/get-revenue-by-seller?month=${month}&year=${year}`,
  //Auth endpoints
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
};
