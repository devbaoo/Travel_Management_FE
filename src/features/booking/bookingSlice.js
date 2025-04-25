import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../booking/bookingService';

export const fetchBookings = createAsyncThunk('booking/fetchAll', async () => {
  const response = await bookingService.getAllBookings();
  return response;
});
export const fetchBookingsBySeller = createAsyncThunk(
  'booking/fetchBySeller',
  async (id) => {
    const response = await bookingService.getAllBookingsBySeller(id);
    return response;
  }
);
export const createBooking = createAsyncThunk('booking/create', async (formData) => {
  const response = await bookingService.createBooking(formData);
  return response;
});

export const updateBooking = createAsyncThunk('booking/update', async ({ id, formData }) => {
  const response = await bookingService.updateBooking(id, formData);
  return response;
});

export const deleteBooking = createAsyncThunk('booking/delete', async (id) => {
  const response = await bookingService.deleteBooking(id);
  return response;
});

export const exportBookingPdf = createAsyncThunk('booking/exportPdf', async (id) => {
  const response = await bookingService.exportBookingPdf(id);
  return response;
});

export const exportBookingTxt = createAsyncThunk('booking/exportTxt', async (id) => {
  const response = await bookingService.exportBookingTxt(id);
  return response;
});

// State quản lý bookings
const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || [];
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBookingsBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || [];
      })
      .addCase(fetchBookingsBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload.data); // Thêm booking vào state
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(b => b.id !== action.meta.arg);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
      });
  },
});

export default bookingSlice.reducer;
