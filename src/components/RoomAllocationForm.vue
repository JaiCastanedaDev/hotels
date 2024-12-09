<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <h2>Asignar Tipos de Habitaciones</h2>
            <h3>Hotel: {{ hotel.name }}</h3>
            <div class="hotel-info">
                <div class="info-card total">
                    <p class="info-label">Habitaciones totales</p>
                    <p class="info-value">{{ hotel.number_of_rooms }}</p>
                </div>
                <div class="info-card assigned">
                    <p class="info-label">Habitaciones asignadas</p>
                    <p class="info-value">{{ totalAssignedRooms }}</p>
                </div>
                <div class="info-card remaining">
                    <p class="info-label">Habitaciones restantes</p>
                    <p class="info-value">{{ remainingRooms }}</p>
                </div>
            </div>

            <button type="button" @click="addRoom" class="add-room-btn" :disabled="remainingRooms <= 0">
                Agregar Tipo de Habitación
            </button>

            <div class="form-container">
                <form @submit.prevent="handleSubmit" v-if="ready">
                    <div
                        v-for="(room, index) in rooms"
                        :key="index"
                        class="room-entry"
                    >
                        <div class="room-header" @click="toggleRoomVisibility(index)">
                            <p><strong>Tipo de Habitación {{ index + 1 }}</strong></p>
                            <button type="button" class="toggle-btn">
                                {{ room.isVisible ? '▲' : '▼' }}
                            </button>
                        </div>
                        <div v-show="room.isVisible" class="room-form">
                            <div>
                            <label>
                                Tipo de Habitación:
                                <select v-model="room.type" @change="updateAccommodationOptions(index)" required>
                                    <option value="" disabled>Seleccionar Tipo</option>
                                    <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                                        {{ type.name }}
                                    </option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Acomodación:
                                <select v-model="room.accommodation" :disabled="!room.type" required>
                                    <option value="" disabled>Seleccionar Acomodación</option>
                                    <option v-for="option in room.accommodationOptions" :key="option" :value="option">
                                        {{ option }}
                                    </option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Cantidad de Habitaciones:
                                <input type="number" v-model.number="room.quantity" :min="1" required
                                    placeholder="Ingrese la cantidad" />
                            </label>
                        </div>
                            <button type="button" @click="removeRoom(index)" class="remove-btn">
                                Quitar
                            </button>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="submit" class="submit-btn">Guardar</button>
                        <button type="button" @click="closeModal" class="cancel-btn">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    props: {
        hotel: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            rooms: [
                {
                    type: "",
                    accommodation: "",
                    quantity: 1,
                    accommodationOptions: [],
                },
            ],
            roomTypes: [],
            ready: false,
        };
    },
    computed: {
        totalAssignedRooms() {
            return this.rooms.reduce((total, room) => total + (room.quantity || 0), 0);
        },
        remainingRooms() {
            return this.hotel.number_of_rooms - this.totalAssignedRooms;
        },
    },
    mounted() {
        this.initializeData();
    },
    methods: {
        async initializeData() {
        try {
            await this.getTypeOptions();
            await this.getRoomAllocations();
            this.ready = true;
        } catch (error) {
            console.error("Error al inicializar los datos:", error);
        }
    },
        addRoom() {
            if (this.remainingRooms <= 0) {
                alert("No hay habitaciones disponibles para asignar.");
                return;
            }
            this.rooms.push({
                type: "",
                accommodation: "",
                quantity: 1,
                accommodationOptions: [],
            });
        },
        removeRoom(index) {
            this.rooms.splice(index, 1);
        },
        updateAccommodationOptions(index) {
            const roomType = this.roomTypes.find((type) => type.id === this.rooms[index].type);
            this.rooms[index].accommodationOptions = roomType ? roomType.allowed_accommodations : [];
            this.rooms[index].accommodation = "";
        },
        async handleSubmit() {
            const toast = useToast();

            // Validar que no exceda la capacidad del hotel
            if (this.totalAssignedRooms > this.hotel.number_of_rooms) {
                toast.error("La suma total de habitaciones asignadas excede la capacidad del hotel.");
                return;
            }

            try {
                const payload = {
                    allocations: this.rooms.map((room) => ({
                        room_type_id: room.type,
                        accommodation: room.accommodation,
                        quantity: room.quantity,
                    })),
                };

                await axios.post(`https://seal-app-m992d.ondigitalocean.app/api/room-allocations/${this.hotel.id}`, payload);

                toast.success("Habitaciones asignadas correctamente.");
                this.$emit("close");
            } catch (error) {
                if (error.response?.data?.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("Error al asignar las habitaciones.");
                }
            }
        },
        toggleRoomVisibility(index) {
            this.rooms[index].isVisible = !this.rooms[index].isVisible;
        },
        async getTypeOptions() {
            try {
                const response = await axios.get("https://seal-app-m992d.ondigitalocean.app/api/room-types");
                this.roomTypes = response.data;
            } catch (error) {
                console.error("Error al obtener los tipos de habitación:", error);
            }
        },
        async getRoomAllocations() {
            try {
                const response = await axios.get(`https://seal-app-m992d.ondigitalocean.app/api/room-allocations/${this.hotel.id}`);

                this.rooms = response.data.map((allocation) => {
                    const roomType = this.roomTypes.find((type) => type.id === allocation.room_type_id);
                    return {
                        type: allocation.room_type_id,
                        accommodation: allocation.accommodation,
                        quantity: allocation.quantity,
                        accommodationOptions: roomType ? roomType.allowed_accommodations : [],
                    };
                });
            } catch (error) {
                console.error("Error al obtener las asignaciones de habitaciones:", error);
            }
        },

        closeModal() {
            this.$emit("close");
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
    animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

h2 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    color: #34495e;
}

h3 {
    text-align: center;
    color: #2c3e50;
    font-size: 1.2rem;
}

.add-room-btn {
    background: #3498db;
    color: #fff;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease, transform 0.2s;
    cursor: pointer;
}

.add-room-btn:hover {
    background: #217dbb;
    transform: translateY(-3px);
}

.add-room-btn:disabled {
    background: #b0bec5;
    cursor: not-allowed;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.form-container {
    flex: 1;
    overflow-y: auto;
    margin-top: 1rem;
    padding-right: 1rem;
}

.room-entry {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 2px solid #ecf0f1;
    padding: 1rem;
    border-radius: 8px;
    background: #f9f9f9;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.room-entry:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

label {
    font-size: 1rem;
    color: #2c3e50;
}

input,
select {
    padding: 0.6rem;
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    transition: border-color 0.3s;
}

input:focus,
select:focus {
    border-color: #3498db;
    outline: none;
}

button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
}

.remove-btn {
    background: #e74c3c;
    color: #fff;
    align-self: flex-end;
    transition: background-color 0.3s, transform 0.2s;
    margin-top: 1rem;
}

.remove-btn:hover {
    background: #c0392b;
    transform: translateY(-3px);
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.submit-btn {
    background: #2ecc71;
    color: #fff;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background: #27ae60;
}

.cancel-btn {
    background: #95a5a6;
    color: #fff;
    transition: background-color 0.3s;
}

.cancel-btn:hover {
    background: #7f8c8d;
}
.hotel-info {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-card {
    flex: 1;
    text-align: center;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: #ffffff;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f9fc;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 5px;
}

.toggle-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #3498db;
    cursor: pointer;
    transition: transform 0.2s;
}

.toggle-btn:hover {
    color: #217dbb;
}

.room-form {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #ffffff;
    margin-bottom: 10px;
}

.info-label {
    font-size: 1rem;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
}

.info-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
}

.info-card.total {
    border: 2px solid #3498db;
    background: linear-gradient(135deg, #eaf6fc, #ffffff);
}

.info-card.assigned {
    border: 2px solid #e67e22;
    background: linear-gradient(135deg, #fef2e6, #ffffff);
}

.info-card.remaining {
    border: 2px solid #2ecc71;
    background: linear-gradient(135deg, #e9f7ef, #ffffff);
}

@media (max-width: 768px) {
    .hotel-info {
        flex-direction: column;
        align-items: center;
    }

    .info-card {
        width: 100%;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes popIn {
    from {
        transform: scale(0.8);
    }
    to {
        transform: scale(1);
    }
}
</style>