import { describe, expect, it, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';
import api from '../lib/api';

vi.mock('../lib/api', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

const apiMock = api as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('logs in and persists token', async () => {
    apiMock.post.mockResolvedValue({
      data: {
        accessToken: 'token-123',
        user: { id: 'u1', email: 'a@b.com', role: 'ADMIN', name: 'Ana' },
      },
    });

    const store = useAuthStore();
    await store.login('a@b.com', 'secret');

    expect(store.token).toBe('token-123');
    expect(store.user?.email).toBe('a@b.com');
    expect(localStorage.getItem('hotel_token')).toBe('token-123');
    expect(store.loading).toBe(false);
    expect(store.error).toBe('');
  });

  it('captures login error message', async () => {
    apiMock.post.mockRejectedValue({
      response: { data: { message: 'Credenciales inválidas' } },
    });

    const store = useAuthStore();
    await store.login('a@b.com', 'bad');

    expect(store.token).toBe('');
    expect(store.error).toBe('Credenciales inválidas');
    expect(store.loading).toBe(false);
  });

  it('refreshes token and user', async () => {
    apiMock.post.mockResolvedValue({
      data: {
        accessToken: 'token-456',
        user: { id: 'u2', email: 'b@b.com', role: 'STAFF', name: 'Beto' },
      },
    });

    const store = useAuthStore();
    const ok = await store.refresh();

    expect(ok).toBe(true);
    expect(store.token).toBe('token-456');
    expect(store.user?.name).toBe('Beto');
    expect(localStorage.getItem('hotel_token')).toBe('token-456');
  });

  it('clears session when refresh fails', async () => {
    apiMock.post.mockRejectedValue(new Error('refresh failed'));

    const store = useAuthStore();
    store.token = 'stale';
    store.user = { id: 'u3', email: 'c@b.com', role: 'ADMIN', name: 'Cora' };
    localStorage.setItem('hotel_token', 'stale');

    const ok = await store.refresh();

    expect(ok).toBe(false);
    expect(store.token).toBe('');
    expect(store.user).toBe(null);
    expect(localStorage.getItem('hotel_token')).toBe(null);
    expect(apiMock.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('calls refresh on me when token is missing', async () => {
    const store = useAuthStore();
    const refreshSpy = vi.spyOn(store, 'refresh').mockResolvedValue(false);

    await store.me();

    expect(refreshSpy).toHaveBeenCalled();
    expect(apiMock.get).not.toHaveBeenCalled();
  });

  it('loads user on me when token exists', async () => {
    apiMock.get.mockResolvedValue({
      data: { id: 'u4', email: 'd@b.com', role: 'STAFF', name: 'Dani' },
    });

    const store = useAuthStore();
    store.token = 'token-789';

    await store.me();

    expect(store.user?.name).toBe('Dani');
  });

  it('logout clears local session', async () => {
    apiMock.post.mockResolvedValue({ data: {} });

    const store = useAuthStore();
    store.token = 'token-000';
    store.user = { id: 'u5', email: 'e@b.com', role: 'STAFF', name: 'Eva' };
    localStorage.setItem('hotel_token', 'token-000');

    store.logout();

    expect(store.token).toBe('');
    expect(store.user).toBe(null);
    expect(localStorage.getItem('hotel_token')).toBe(null);
    expect(apiMock.post).toHaveBeenCalledWith('/auth/logout');
  });
});
