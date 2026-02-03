<script setup lang="ts">
defineProps<{ room: any }>();
defineEmits<{
  (e: 'check-in', roomId: string): void;
  (e: 'check-out', roomId: string): void;
  (e: 'clean', roomId: string): void;
  (e: 'maintenance', roomId: string): void;
}>();

const statusColors = {
  AVAILABLE: 'bg-available text-white',
  OCCUPIED: 'bg-occupied text-white',
  DIRTY: 'bg-dirty text-black',
  MAINTENANCE: 'bg-maintenance text-white'
};
</script>

<template>
  <div :class="['p-4 rounded-xl shadow-md transition-transform hover:scale-105 space-y-4 card-animate', statusColors[room.status as keyof typeof statusColors]]">
    <div class="flex items-center justify-between">
      <div class="text-2xl font-bold">#{{ room.number }}</div>
      <div class="text-xs uppercase tracking-widest opacity-80">{{ room.status }}</div>
    </div>
    <div>
      <div class="text-sm uppercase opacity-90">{{ room.type }}</div>
      <div class="mt-2 font-semibold">${{ room.price }}</div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <button
        class="card-action"
        :disabled="room.status !== 'AVAILABLE'"
        @click="$emit('check-in', room.id)"
      >
        Check-in
      </button>
      <button
        class="card-action"
        :disabled="room.status !== 'OCCUPIED'"
        @click="$emit('check-out', room.id)"
      >
        Check-out
      </button>
      <button
        class="card-action"
        :disabled="room.status !== 'DIRTY'"
        @click="$emit('clean', room.id)"
      >
        Limpiar
      </button>
      <button
        class="card-action"
        :disabled="room.status === 'OCCUPIED'"
        @click="$emit('maintenance', room.id)"
      >
        Mantener
      </button>
    </div>
  </div>
</template>
