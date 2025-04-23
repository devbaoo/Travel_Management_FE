import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./../features/seller/sellerSlice";
import bookingReducer from "./../features/booking/bookingSlice";

export const store = configureStore({
	reducer: {
        // Add your slices here
        seller: sellerReducer,
        booking: bookingReducer,
	
	},
});