<template>
  <img src="../assets/decameron-logo.png" alt="Decameron Logo" class="logo" />
  <div class="hotel-list-container">
    <div class="header">
      <h1 class="title">🌟 Lista de Hoteles</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="fas fa-plus"></i> Nuevo Hotel
      </button>
    </div>

    <div v-if="hotels.length" class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>NIT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hotel in hotels" :key="hotel.id">
            <td>{{ hotel.name }}</td>
            <td>{{ hotel.address }}</td>
            <td>{{ hotel.city }}</td>
            <td>{{ hotel.nit }}</td>
            <td>
              <button class="btn btn-warning" @click="editHotel(hotel)">
                 Habitaciones
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger" @click="deleteHotel(hotel)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="no-hotels-message">
      <p>No se han registrado hoteles aún.</p>
    </div>

    <CreateHotelModal v-if="showCreateModal" @close="closeCreateModal" @hotel-created="getHotels" />
    <RoomAllocationForm v-if="showRoomAllocationForm" @close="closeRoomAllocationForm" :hotel="selectedHotel" />
  </div>
</template>

<script>
import CreateHotelModal from './CreateHotelModal.vue'
import axios from 'axios';
import RoomAllocationForm from './RoomAllocationForm.vue';
import { useToast } from 'vue-toastification';


export default {
  data() {
    return {
      hotels: [],
      showCreateModal: false,
      showRoomAllocationForm: false,
      selectedHotel: null,
    };
  },
  components: {
    CreateHotelModal,
    RoomAllocationForm,
  },
  methods: {
    async getHotels() {
    try {
      const response = await axios.get('http://localhost:8000/api/hotels');
      this.hotels = response.data;
    } catch (error) {
      throw new Error('Error al obtener los hoteles: ' + error);
    }
  },
    openCreateModal() {
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    editHotel(hotel) {
      this.selectedHotel = hotel;
      this.showRoomAllocationForm = true;
    },
    closeRoomAllocationForm() {
      this.showRoomAllocationForm = false;
    },
    async deleteHotel(hotel) {
      const toast = useToast();
      try {
        await axios.delete(`http://localhost:8000/api/hotels/${hotel.id}`);
        toast.success('Hotel eliminado exitosamente');
        this.getHotels();
      } catch (error) {
        toast.warning('Error al eliminar el hotel');
      }
    },
  },
  mounted() {
    this.getHotels();
  },
};
</script>

<style scoped>
.hotel-list-container {
  padding: 20px;
  background: linear-gradient(135deg, #ffffff, #ffffff);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #d0d0d0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  animation: fadeIn 1s ease;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(150deg, #044EA2, #044EA2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-primary {
  background: linear-gradient(150deg, #044EA2, #044EA2);
  border: none;
  color: #fff;
  padding: 10px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(52, 152, 219, 0.3);
}

.table-responsive {
  overflow-x: auto;
  margin-top: 10px;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table th,
.table td {
  padding: 15px;
  text-align: left;
  font-size: 1rem;
  color: #34495e;
  border-bottom: 1px solid #e6e6e6;
}

.table th {
  background: linear-gradient(150deg, #044EA2, #044EA2);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}

.table tbody tr {
  transition: background-color 0.3s, transform 0.2s;
}

.table tbody tr:hover {
  background-color: #f0f9ff;
  transform: scale(1.02);
}

.btn-warning,
.btn-danger {
  border: none;
  color: #fff;
  padding: 10px 14px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.btn-warning {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
}

.btn-warning:hover {
  background: #d4ac0d;
  transform: scale(1.1);
}

.btn-danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.btn-danger:hover {
  background: #a93226;
  transform: scale(1.1);
}

.no-hotels-message {
  text-align: center;
  font-size: 1.5rem;
  color: #7f8c8d;
  margin-top: 30px;
  animation: fadeIn 1.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>