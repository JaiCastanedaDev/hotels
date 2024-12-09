import axios from 'axios';
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

const hotelService = {
  async getHotels() {
    try {
      const response = await axios.get(`${API_URL}/hotels`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los hoteles: ' + error);
    }
  },
  async getHotelById(id) {
    try {
      const response = await axios.get(`${API_URL}/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el hotel: ' + error);
    }
  },
};

export default hotelService;
