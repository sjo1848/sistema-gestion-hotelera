import { defineStore } from 'pinia';
import api from '../lib/api';

let toastTimer: ReturnType<typeof setTimeout> | null = null;

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
    error: '',
    actionError: '',
    actionSuccess: '',
  }),
  getters: {
    totalRooms: (state) => state.rooms.length,
    availableRooms: (state) => state.rooms.filter((r) => r.status === 'AVAILABLE').length,
    occupiedRooms: (state) => state.rooms.filter((r) => r.status === 'OCCUPIED').length,
    dirtyRooms: (state) => state.rooms.filter((r) => r.status === 'DIRTY').length,
    maintenanceRooms: (state) => state.rooms.filter((r) => r.status === 'MAINTENANCE').length,
  },
  actions: {
    setToast(success: string, error: string) {
      this.actionSuccess = success;
      this.actionError = error;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        this.actionSuccess = '';
        this.actionError = '';
      }, 4000);
    },
    async fetchRooms() {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.get('/rooms');
        this.rooms = response.data;
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Error cargando habitaciones';
        console.error("Error cargando habitaciones:", error);
      } finally {
        this.loading = false;
      }
    },
    async checkIn(roomId: string, guestName: string) {
      try {
        await api.post(`/rooms/${roomId}/check-in`, { guestName });
        this.setToast('Check-in registrado', '');
        await this.fetchRooms();
      } catch (error: any) {
        this.setToast('', error?.response?.data?.message || 'Error en check-in');
      }
    },
    async checkOut(roomId: string) {
      try {
        await api.post(`/rooms/${roomId}/check-out`);
        this.setToast('Check-out registrado', '');
        await this.fetchRooms();
      } catch (error: any) {
        this.setToast('', error?.response?.data?.message || 'Error en check-out');
      }
    },
    async markClean(roomId: string) {
      try {
        await api.post(`/rooms/${roomId}/clean`);
        this.setToast('Habitación marcada como limpia', '');
        await this.fetchRooms();
      } catch (error: any) {
        this.setToast('', error?.response?.data?.message || 'Error al limpiar');
      }
    },
    async sendMaintenance(roomId: string) {
      try {
        await api.post(`/rooms/${roomId}/maintenance`);
        this.setToast('Habitación enviada a mantenimiento', '');
        await this.fetchRooms();
      } catch (error: any) {
        this.setToast('', error?.response?.data?.message || 'Error en mantenimiento');
      }
    },
    async createRoom(payload: { number: string; type: string; price: number; status?: Room['status'] }) {
      try {
        await api.post('/rooms', payload);
        this.setToast('Habitación creada', '');
        await this.fetchRooms();
      } catch (error: any) {
        this.setToast('', error?.response?.data?.message || 'Error al crear habitación');
      }
    },
  }
});
