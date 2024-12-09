<template>
    <div>
      <h2>{{ hotel ? 'Editar' : 'Crear' }} Hotel</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Nombre</label>
          <input v-model="formData.name" type="text" id="name" required />
        </div>
        <div>
          <label for="address">Dirección</label>
          <input v-model="formData.address" type="text" id="address" required />
        </div>
        <div>
          <label for="city">Ciudad</label>
          <input v-model="formData.city" type="text" id="city" required />
        </div>
        <div>
          <label for="nit">NIT</label>
          <input v-model="formData.nit" type="text" id="nit" required />
        </div>
        <div>
          <label for="number_of_rooms">Número de Habitaciones</label>
          <input v-model="formData.number_of_rooms" type="number" id="number_of_rooms" required />
        </div>
        <button type="submit">{{ hotel ? 'Actualizar' : 'Crear' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import hotelService from '@/services/hotelService';
  // eslint-disable-next-line no-unused-vars
  import { mapGetters } from 'vuex';
  
  export default {
    props: {
      hotel: Object,
    },
    data() {
      return {
        formData: {
          name: this.hotel ? this.hotel.name : '',
          address: this.hotel ? this.hotel.address : '',
          city: this.hotel ? this.hotel.city : '',
          nit: this.hotel ? this.hotel.nit : '',
          number_of_rooms: this.hotel ? this.hotel.number_of_rooms : 1,
        },
      };
    },
    methods: {
      async submitForm() {
        try {
          if (this.hotel) {
            await hotelService.updateHotel(this.hotel.id, this.formData);
            this.$router.push({ name: 'hotelDetail', params: { id: this.hotel.id } });
          } else {
            await hotelService.createHotel(this.formData);
            this.$router.push({ name: 'hotelList' });
          }
        } catch (error) {
          console.error('Error al guardar el hotel:', error);
        }
      },
    },
  };
  </script>
  