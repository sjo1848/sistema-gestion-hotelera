import { describe, expect, it } from 'vitest';
import { filterRooms, type Room } from './roomFilters';

const rooms: Room[] = [
  { id: '1', number: '101', type: 'Simple', status: 'AVAILABLE', price: 50 },
  { id: '2', number: '202', type: 'Suite', status: 'OCCUPIED', price: 150 },
  { id: '3', number: '303', type: 'Doble', status: 'DIRTY', price: 80 },
  { id: '4', number: '404', type: 'Presidential', status: 'MAINTENANCE', price: 300 },
];

describe('filterRooms', () => {
  it('returns all rooms when filters are ALL and search is empty', () => {
    const result = filterRooms(rooms, { text: '', status: 'ALL', type: 'ALL' });
    expect(result).toHaveLength(4);
  });

  it('filters by text (number or type) case-insensitively', () => {
    const byNumber = filterRooms(rooms, { text: '202', status: 'ALL', type: 'ALL' });
    expect(byNumber.map((r) => r.id)).toEqual(['2']);

    const byType = filterRooms(rooms, { text: 'suite', status: 'ALL', type: 'ALL' });
    expect(byType.map((r) => r.id)).toEqual(['2']);
  });

  it('filters by status and type', () => {
    const result = filterRooms(rooms, { text: '', status: 'DIRTY', type: 'Doble' });
    expect(result.map((r) => r.id)).toEqual(['3']);
  });

  it('combines text, status, and type filters', () => {
    const result = filterRooms(rooms, { text: '4', status: 'MAINTENANCE', type: 'Presidential' });
    expect(result.map((r) => r.id)).toEqual(['4']);
  });
});
