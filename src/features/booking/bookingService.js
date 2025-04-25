import axios from 'axios';
import { API_ENDPOINTS } from './../../configs/apiConfig'; // Đảm bảo bạn có config đúng endpoint

const bookingService = {
  createBooking: async (formData) => {
    const res = await axios.post(API_ENDPOINTS.CREATE_BOOKING, formData);
    return res.data;
  },

  getAllBookings: async () => {
    const res = await axios.get(API_ENDPOINTS.GET_ALL_BOOKINGS);
    return res.data;
  },
  getAllBookingsBySeller: async (id) => {

    const res = await axios.get(API_ENDPOINTS.GET_ALL_BOOKINGS_BY_SELLER(id));
    return res.data;
  },

  getBookingById: async (id) => {
    const res = await axios.get(API_ENDPOINTS.GET_BOOKING_BY_ID(id));
    return res.data;
  },

  updateBooking: async (id, formData) => {
    const res = await axios.put(API_ENDPOINTS.UPDATE_BOOKING(id), formData);
    return res.data;
  },

  deleteBooking: async (id) => {
    const res = await axios.delete(API_ENDPOINTS.DELETE_BOOKING(id));
    return res.data;
  },

  exportBookingPdf: async (id) => {
    const res = await axios.get(API_ENDPOINTS.EXPORT_BOOKING_PDF(id));
    return res.data;
  },

  exportBookingTxt: async (id) => {
    const res = await axios.get(API_ENDPOINTS.EXPORT_BOOKING_TXT(id));
    return res.data;
  },
};

export default bookingService;
