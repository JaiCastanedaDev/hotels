import { createStore } from 'vuex';
import hotelService from '@/services/hotelService';

export default createStore({
  state: {
    hotels: [],
  },
  mutations: {
    setHotels(state, hotels) {
      state.hotels = hotels;
    },
  },
  actions: {
    async fetchHotels({ commit }) {
      try {
        const response = await hotelService.getHotels();
        commit('setHotels', response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    },
  },
  getters: {
    getHotels(state) {
      return state.hotels;
    },
  },
});
