import { defineStore } from 'pinia';
import axios from 'axios';

// Definimos cómo es una habitación para TypeScript
interface Room {
  id: string;
  number: string;
  type: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE';
  price: number;
}

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    rooms: [] as Room[],
    loading: false,
  }),
  actions: {
    async fetchRooms() {
      this.loading = true;
      try {
        // Apuntamos a tu backend en Docker
        const response = await axios.get('http://localhost:3000/rooms');
        this.rooms = response.data;
      } catch (error) {
        console.error("Error cargando habitaciones:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});
