<script setup lang="ts">
import { onMounted } from 'vue';
import { useHotelStore } from './stores/hotel';
import RoomCard from './components/RoomCard.vue';

const hotelStore = useHotelStore();

onMounted(() => {
  hotelStore.fetchRooms();
});
</script>

<template>
  <div class="min-h-screen p-8">
    <header class="mb-8 border-b pb-4 flex justify-between items-center">
      <h1 class="text-3xl font-extrabold text-hotel-blue">PMS Hotel Palo Alto</h1>
      <div class="flex gap-4 text-sm">
        <span class="flex items-center gap-1"><div class="w-3 h-3 bg-available rounded-full"></div> Libre</span>
        <span class="flex items-center gap-1"><div class="w-3 h-3 bg-occupied rounded-full"></div> Ocupada</span>
      </div>
    </header>

    <main v-if="!hotelStore.loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <RoomCard 
        v-for="room in hotelStore.rooms" 
        :key="room.id" 
        :room="room" 
      />
    </main>

    <div v-else class="text-center py-20 text-xl animate-pulse">
      Cargando el estado del hotel...
    </div>
  </div>
</template>
