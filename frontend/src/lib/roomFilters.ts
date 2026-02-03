export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE';
export type RoomType = 'Simple' | 'Doble' | 'Suite' | 'Presidential';

export type Room = {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
};

export type RoomFilters = {
  text: string;
  status: 'ALL' | RoomStatus;
  type: 'ALL' | RoomType;
};

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  const text = filters.text.trim().toLowerCase();
  return rooms.filter((room) => {
    const matchesText = text
      ? room.number.toLowerCase().includes(text) || room.type.toLowerCase().includes(text)
      : true;
    const matchesStatus = filters.status === 'ALL' ? true : room.status === filters.status;
    const matchesType = filters.type === 'ALL' ? true : room.type === filters.type;
    return matchesText && matchesStatus && matchesType;
  });
}
