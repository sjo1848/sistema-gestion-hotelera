<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useHotelStore } from './stores/hotel';
import { useAuthStore } from './stores/auth';
import RoomCard from './components/RoomCard.vue';

const hotelStore = useHotelStore();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const activeRoomId = ref('');
const guestName = ref('');
const showCheckIn = ref(false);
const showCreateRoom = ref(false);

const searchText = ref('');
const statusFilter = ref<'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE'>('ALL');
const typeFilter = ref<'ALL' | 'Simple' | 'Doble' | 'Suite' | 'Presidential'>('ALL');

const newRoom = ref({
  number: '',
  type: 'Simple',
  price: 50,
  status: 'AVAILABLE' as const,
});

const isAuthed = computed(() => !!authStore.token);

onMounted(async () => {
  await authStore.me();
  if (isAuthed.value) {
    hotelStore.fetchRooms();
  }
});

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (isAuthed.value) {
    hotelStore.fetchRooms();
  }
};

const refreshRooms = () => {
  hotelStore.fetchRooms();
};

const openCheckIn = (roomId: string) => {
  activeRoomId.value = roomId;
  guestName.value = '';
  showCheckIn.value = true;
};

const closeCheckIn = () => {
  showCheckIn.value = false;
  activeRoomId.value = '';
};

const submitCheckIn = async () => {
  if (!activeRoomId.value || !guestName.value.trim()) return;
  await hotelStore.checkIn(activeRoomId.value, guestName.value.trim());
  closeCheckIn();
};
const handleCheckOut = async (roomId: string) => {
  confirmAction.value = {
    title: 'Confirmar check-out',
    message: '¿Querés registrar el check-out ahora?',
    action: async () => {
      await hotelStore.checkOut(roomId);
    },
  };
};
const handleClean = async (roomId: string) => {
  confirmAction.value = {
    title: 'Confirmar limpieza',
    message: '¿Marcar la habitación como limpia?',
    action: async () => {
      await hotelStore.markClean(roomId);
    },
  };
};
const handleMaintenance = async (roomId: string) => {
  confirmAction.value = {
    title: 'Confirmar mantenimiento',
    message: '¿Enviar la habitación a mantenimiento?',
    action: async () => {
      await hotelStore.sendMaintenance(roomId);
    },
  };
};

const closeConfirm = () => {
  confirmAction.value = null;
};

const submitConfirm = async () => {
  if (!confirmAction.value) return;
  await confirmAction.value.action();
  closeConfirm();
};

const confirmAction = ref<null | { title: string; message: string; action: () => Promise<void> }>(null);

const filteredRooms = computed(() => {
  const text = searchText.value.trim().toLowerCase();
  return hotelStore.rooms.filter((room) => {
    const matchesText = text
      ? room.number.toLowerCase().includes(text) || room.type.toLowerCase().includes(text)
      : true;
    const matchesStatus = statusFilter.value === 'ALL' ? true : room.status === statusFilter.value;
    const matchesType = typeFilter.value === 'ALL' ? true : room.type === typeFilter.value;
    return matchesText && matchesStatus && matchesType;
  });
});

const openCreateRoom = () => {
  newRoom.value = { number: '', type: 'Simple', price: 50, status: 'AVAILABLE' };
  showCreateRoom.value = true;
};
const closeCreateRoom = () => {
  showCreateRoom.value = false;
};
const submitCreateRoom = async () => {
  if (!newRoom.value.number.trim()) return;
  await hotelStore.createRoom({
    number: newRoom.value.number.trim(),
    type: newRoom.value.type,
    price: Number(newRoom.value.price),
    status: newRoom.value.status,
  });
  closeCreateRoom();
};
</script>

<template>
  <div class="min-h-screen bg-hotel-ink text-slate-100">
    <div class="page-noise"></div>
    <header class="px-8 py-8 border-b border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-4xl font-black tracking-tight text-hotel-cream">PMS Hotel Palo Alto</h1>
        <p class="text-sm text-white/60">Panel operativo en tiempo real</p>
      </div>
      <div class="flex gap-4 text-sm">
        <span class="flex items-center gap-2"><div class="w-3 h-3 bg-available rounded-full"></div> Libre</span>
        <span class="flex items-center gap-2"><div class="w-3 h-3 bg-occupied rounded-full"></div> Ocupada</span>
        <span class="flex items-center gap-2"><div class="w-3 h-3 bg-dirty rounded-full"></div> Sucia</span>
        <span class="flex items-center gap-2"><div class="w-3 h-3 bg-maintenance rounded-full"></div> Mantenimiento</span>
      </div>
    </header>

    <main class="px-8 py-10">
      <section v-if="!isAuthed" class="max-w-md mx-auto glass-card p-8">
        <h2 class="text-2xl font-bold text-hotel-cream">Acceso del staff</h2>
        <p class="text-sm text-white/60 mb-6">Usá tus credenciales para ingresar.</p>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
            <input v-model="email" type="email" class="input-dark" placeholder="staff@paloalto.com" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
            <input v-model="password" type="password" class="input-dark" placeholder="••••••••" />
          </div>
          <button class="btn-primary w-full" :disabled="authStore.loading">
            {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
          <p v-if="authStore.error" class="text-sm text-red-300">{{ authStore.error }}</p>
        </form>
      </section>

      <section v-else>
        <div class="flex flex-col gap-6 mb-6">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-hotel-cream">Habitaciones</h2>
              <p class="text-sm text-white/60">
                Bienvenido, {{ authStore.user?.name }} ({{ authStore.user?.role }})
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button class="btn-secondary" @click="refreshRooms">Refrescar</button>
              <button v-if="authStore.user?.role === 'ADMIN'" class="btn-primary" @click="openCreateRoom">Nueva habitación</button>
              <button class="btn-secondary" @click="authStore.logout()">Cerrar sesión</button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="metric-card">
              <span class="metric-label">Total</span>
              <span class="metric-value">{{ hotelStore.totalRooms }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Libres</span>
              <span class="metric-value text-available">{{ hotelStore.availableRooms }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Ocupadas</span>
              <span class="metric-value text-occupied">{{ hotelStore.occupiedRooms }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Sucia/Mant.</span>
              <span class="metric-value text-dirty">{{ hotelStore.dirtyRooms + hotelStore.maintenanceRooms }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex-1">
              <input v-model="searchText" class="input-dark" placeholder="Buscar por número o tipo..." />
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="chip" :class="{ active: statusFilter === 'ALL' }" @click="statusFilter = 'ALL'">Todos</button>
              <button class="chip" :class="{ active: statusFilter === 'AVAILABLE' }" @click="statusFilter = 'AVAILABLE'">Libres</button>
              <button class="chip" :class="{ active: statusFilter === 'OCCUPIED' }" @click="statusFilter = 'OCCUPIED'">Ocupadas</button>
              <button class="chip" :class="{ active: statusFilter === 'DIRTY' }" @click="statusFilter = 'DIRTY'">Sucias</button>
              <button class="chip" :class="{ active: statusFilter === 'MAINTENANCE' }" @click="statusFilter = 'MAINTENANCE'">Mantenimiento</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="chip" :class="{ active: typeFilter === 'ALL' }" @click="typeFilter = 'ALL'">Todos tipos</button>
              <button class="chip" :class="{ active: typeFilter === 'Simple' }" @click="typeFilter = 'Simple'">Simple</button>
              <button class="chip" :class="{ active: typeFilter === 'Doble' }" @click="typeFilter = 'Doble'">Doble</button>
              <button class="chip" :class="{ active: typeFilter === 'Suite' }" @click="typeFilter = 'Suite'">Suite</button>
              <button class="chip" :class="{ active: typeFilter === 'Presidential' }" @click="typeFilter = 'Presidential'">Presidential</button>
            </div>
          </div>
        </div>

        <div v-if="hotelStore.actionSuccess" class="toast toast-success">
          {{ hotelStore.actionSuccess }}
        </div>
        <div v-if="hotelStore.actionError" class="toast toast-error">
          {{ hotelStore.actionError }}
        </div>
        <p v-if="hotelStore.error" class="mb-4 text-sm text-red-300">{{ hotelStore.error }}</p>

        <div v-if="hotelStore.loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="n in 10" :key="n" class="skeleton-card">
            <div class="skeleton-line w-16"></div>
            <div class="skeleton-line w-24"></div>
            <div class="skeleton-line w-12 mt-6"></div>
            <div class="skeleton-line w-20 mt-2"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <RoomCard 
            v-for="(room, index) in filteredRooms" 
            :key="room.id" 
            :room="room" 
            :style="{ animationDelay: `${index * 40}ms` }"
            @check-in="openCheckIn"
            @check-out="handleCheckOut"
            @clean="handleClean"
            @maintenance="handleMaintenance"
          />
        </div>
      </section>
    </main>

    <div v-if="showCheckIn" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">Nuevo check-in</h3>
        <p class="text-sm text-white/60 mb-6">Asigná el huésped para la habitación seleccionada.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Nombre huésped</label>
            <input v-model="guestName" type="text" class="input-dark" placeholder="Juan Perez" />
          </div>
          <div class="flex gap-3">
            <button class="btn-primary w-full" @click="submitCheckIn">Confirmar</button>
            <button class="btn-secondary w-full" @click="closeCheckIn">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="confirmAction" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">{{ confirmAction.title }}</h3>
        <p class="text-sm text-white/60 mb-6">{{ confirmAction.message }}</p>
        <div class="flex gap-3">
          <button class="btn-primary w-full" @click="submitConfirm">Confirmar</button>
          <button class="btn-secondary w-full" @click="closeConfirm">Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="showCreateRoom" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">Nueva habitación</h3>
        <p class="text-sm text-white/60 mb-6">Solo ADMIN puede crear habitaciones.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Número</label>
            <input v-model="newRoom.number" type="text" class="input-dark" placeholder="301" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Tipo</label>
            <select v-model="newRoom.type" class="input-dark">
              <option>Simple</option>
              <option>Doble</option>
              <option>Suite</option>
              <option>Presidential</option>
            </select>
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Precio</label>
            <input v-model.number="newRoom.price" type="number" class="input-dark" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Estado</label>
            <select v-model="newRoom.status" class="input-dark">
              <option>AVAILABLE</option>
              <option>OCCUPIED</option>
              <option>DIRTY</option>
              <option>MAINTENANCE</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button class="btn-primary w-full" @click="submitCreateRoom">Crear</button>
            <button class="btn-secondary w-full" @click="closeCreateRoom">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
