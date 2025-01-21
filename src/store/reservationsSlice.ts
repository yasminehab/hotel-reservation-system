import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { updateRoomBookedDates } from './roomSlice';

interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
}

interface ReservationsState {
  reservations: Reservation[];
}

const initialState: ReservationsState = {
  reservations: [],
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    removeReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(
        (reservation) => reservation.id !== action.payload
      );
    },
  },
});

export const { addReservation, removeReservation } = reservationsSlice.actions;

export const createReservation =
  (reservation: Omit<Reservation, 'id'>): AppThunk =>
  async (dispatch) => {
    const newReservation = {
      ...reservation,
      id: Date.now().toString(),
    };

    dispatch(addReservation(newReservation));

    const bookedDates: string[] = [];
    let currentDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    while (currentDate <= checkOutDate) {
      bookedDates.push(currentDate.toISOString().split('T')[0]); 
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dispatch(updateRoomBookedDates({ roomId: reservation.roomId, dates: bookedDates }));
  };

export default reservationsSlice.reducer;
