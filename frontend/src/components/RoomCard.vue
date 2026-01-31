<script setup lang="ts">
defineProps<{ room: any }>();

const statusColors = {
  AVAILABLE: 'bg-available text-white',
  OCCUPIED: 'bg-occupied text-white',
  DIRTY: 'bg-dirty text-black',
  MAINTENANCE: 'bg-maintenance text-white'
};
</script>

<template>
  <div :class="['p-4 rounded-lg shadow-md transition-transform hover:scale-105', statusColors[room.status as keyof typeof statusColors]]">
    <div class="text-2xl font-bold">#{{ room.number }}</div>
    <div class="text-sm uppercase opacity-90">{{ room.type }}</div>
    <div class="mt-4 font-semibold">${{ room.price }}</div>
    <div class="text-xs mt-1 italic">{{ room.status }}</div>
  </div>
</template>
