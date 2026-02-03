import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHotelStore } from './hotel';
import api from '../lib/api';

vi.mock('../lib/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

const apiMock = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

describe('hotel store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
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

  it('fetches rooms and updates state', async () => {
    apiMock.get.mockResolvedValue({
      data: [{ id: '1', number: '101', type: 'Simple', status: 'AVAILABLE', price: 50 }],
    });
    const store = useHotelStore();

    await store.fetchRooms();

    expect(apiMock.get).toHaveBeenCalledWith('/rooms');
    expect(store.rooms).toHaveLength(1);
    expect(store.loading).toBe(false);
    expect(store.error).toBe('');
  });

  it('sets error when fetchRooms fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    apiMock.get.mockRejectedValue({ response: { data: { message: 'Boom' } } });
    const store = useHotelStore();

    await store.fetchRooms();

    expect(store.error).toBe('Boom');
    consoleSpy.mockRestore();
  });

  it('checkIn success sets toast and refreshes rooms', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    apiMock.get.mockResolvedValue({ data: [] });
    const store = useHotelStore();
    const refreshSpy = vi.spyOn(store, 'fetchRooms');

    await store.checkIn('room-1', 'Guest');

    expect(apiMock.post).toHaveBeenCalledWith('/rooms/room-1/check-in', { guestName: 'Guest' });
    expect(store.actionSuccess).toBe('Check-in registrado');
    expect(store.actionError).toBe('');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('checkIn error sets error toast', async () => {
    apiMock.post.mockRejectedValue({ response: { data: { message: 'Error en check-in' } } });
    const store = useHotelStore();

    await store.checkIn('room-1', 'Guest');

    expect(store.actionSuccess).toBe('');
    expect(store.actionError).toBe('Error en check-in');
  });

  it('checkOut success sets toast and refreshes rooms', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    apiMock.get.mockResolvedValue({ data: [] });
    const store = useHotelStore();
    const refreshSpy = vi.spyOn(store, 'fetchRooms');

    await store.checkOut('room-2');

    expect(apiMock.post).toHaveBeenCalledWith('/rooms/room-2/check-out');
    expect(store.actionSuccess).toBe('Check-out registrado');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('markClean success sets toast and refreshes rooms', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    apiMock.get.mockResolvedValue({ data: [] });
    const store = useHotelStore();
    const refreshSpy = vi.spyOn(store, 'fetchRooms');

    await store.markClean('room-3');

    expect(apiMock.post).toHaveBeenCalledWith('/rooms/room-3/clean');
    expect(store.actionSuccess).toBe('Habitación marcada como limpia');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('sendMaintenance success sets toast and refreshes rooms', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    apiMock.get.mockResolvedValue({ data: [] });
    const store = useHotelStore();
    const refreshSpy = vi.spyOn(store, 'fetchRooms');

    await store.sendMaintenance('room-4');

    expect(apiMock.post).toHaveBeenCalledWith('/rooms/room-4/maintenance');
    expect(store.actionSuccess).toBe('Habitación enviada a mantenimiento');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('createRoom success sets toast and refreshes rooms', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    apiMock.get.mockResolvedValue({ data: [] });
    const store = useHotelStore();
    const refreshSpy = vi.spyOn(store, 'fetchRooms');

    await store.createRoom({ number: '501', type: 'Simple', price: 120, status: 'AVAILABLE' });

    expect(apiMock.post).toHaveBeenCalledWith('/rooms', {
      number: '501',
      type: 'Simple',
      price: 120,
      status: 'AVAILABLE',
    });
    expect(store.actionSuccess).toBe('Habitación creada');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('toast auto clears after delay', async () => {
    const store = useHotelStore();

    store.setToast('ok', '');
    expect(store.actionSuccess).toBe('ok');

    vi.advanceTimersByTime(4000);
    expect(store.actionSuccess).toBe('');
    expect(store.actionError).toBe('');
  });
});
