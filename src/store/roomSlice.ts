import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Room {
  id: string;
  type: string;
  price: number;
  available: boolean;
  description: string;
  amenities: string[];
  capacity: number;
  bookedDates: string[];
}

interface RoomsState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateRoomBookedDates: (
      state,
      action: PayloadAction<{ roomId: string; dates: string[] }>
    ) => {
      const room = state.rooms.find((room) => room.id === action.payload.roomId);
      if (room) {
        room.bookedDates = [...new Set([...room.bookedDates, ...action.payload.dates])];
      }
    },
  },
});

export const { setRooms, setLoading, setError, updateRoomBookedDates } = roomSlice.actions;

export default roomSlice.reducer;
