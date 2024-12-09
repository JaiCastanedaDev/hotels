<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Nuevo Hotel</h2>
      <form @submit.prevent="submitForm">
        <!-- Campos del formulario -->
        <div class="form-group">
          <label for="name">Nombre del Hotel</label>
          <input type="text" id="name" v-model="hotel.name" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="address">Dirección</label>
          <input type="text" id="address" v-model="hotel.address" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="city">Ciudad</label>
          <input type="text" id="city" v-model="hotel.city" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="nit">NIT</label>
          <input type="text" id="nit" v-model="hotel.nit" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="rooms">Número de Habitaciones</label>
          <input type="number" id="rooms" v-model="hotel.rooms" class="form-control" required />
        </div>

        <!-- Botones de acción -->
        <div class="buttons">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="submit" class="btn btn-success">Crear Hotel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      hotel: {
        name: '',
        address: '',
        city: '',
        nit: '',
        rooms: 0,
      },
    };
  },
  methods: {
    async submitForm() {
      const formData = {
        name: this.hotel.name,
        address: this.hotel.address,
        city: this.hotel.city,
        nit: this.hotel.nit,
        number_of_rooms: this.hotel.rooms,
      };
      const toast = useToast();
      try {
        const response = await axios.post('http://localhost:8000/api/hotels', formData);
        this.response = response.data;
        toast.success('Hotel creado exitosamente');
        this.closeModal();
        this.$emit('hotel-created');
      } catch (error) {
        this.response = error.response.data.message;
        toast.warning(error.response.data.message);
      }
    },

    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.buttons {
  display: flex;
  justify-content: space-between;
}
</style>