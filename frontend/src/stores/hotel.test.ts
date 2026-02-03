import { describe, expect, it, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHotelStore } from './hotel';

describe('hotel store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('computes room metrics correctly', () => {
    const store = useHotelStore();
    store.rooms = [
      { id: '1', number: '101', type: 'Simple', status: 'AVAILABLE', price: 50 },
      { id: '2', number: '102', type: 'Suite', status: 'OCCUPIED', price: 150 },
      { id: '3', number: '103', type: 'Doble', status: 'DIRTY', price: 80 },
      { id: '4', number: '104', type: 'Simple', status: 'MAINTENANCE', price: 50 },
    ];

    expect(store.totalRooms).toBe(4);
    expect(store.availableRooms).toBe(1);
    expect(store.occupiedRooms).toBe(1);
    expect(store.dirtyRooms).toBe(1);
    expect(store.maintenanceRooms).toBe(1);
  });
});
