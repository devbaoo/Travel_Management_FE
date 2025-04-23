import axios from 'axios';
import { API_ENDPOINTS } from './../../configs/apiConfig';

const sellerService = {
     createSeller :async (formData) => {
        try {
            const res = await axios.post(API_ENDPOINTS.CREATE_SELLER, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res.data); // Log the response to confirm the backend's success response
            return res.data;
        } catch (error) {
            console.error('Error creating seller', error);
            throw error;
        }
    },
  getAllSellers: async () => {
    const res = await axios.get(API_ENDPOINTS.GET_ALL_SELLERS);
    return res.data;
  },

  getSellerDetail: async (id) => {
    const res = await axios.get(API_ENDPOINTS.GET_SELLER_DETAIL(id));
    return res.data;
  },

  deleteSeller: async (id) => {
    const res = await axios.delete(API_ENDPOINTS.DELETE_SELLER(id));
    return res.data;
  },

  updateSeller: async (id, formData) => {
    const res = await axios.put(API_ENDPOINTS.UPDATE_SELLER(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default sellerService;