import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerService from '../seller/sellerService';

// Fetch sellers
export const fetchSellers = createAsyncThunk('seller/fetchAll', async () => {
  const response = await sellerService.getAllSellers();
  return response; // Dữ liệu trả về từ API
});

// Các action còn lại cho seller (create, delete, update)
export const createSeller = createAsyncThunk('seller/create', async (formData) => {
  return await sellerService.createSeller(formData);
});

export const deleteSeller = createAsyncThunk('seller/delete', async (id) => {
  return await sellerService.deleteSeller(id);
});

export const updateSeller = createAsyncThunk('seller/update', async ({ id, formData }) => {
  return await sellerService.updateSeller(id, formData);
});

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    sellers: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload.sellers || []; // Đảm bảo lấy dữ liệu đúng
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default sellerSlice.reducer;