import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { createReservation } from "../store/reservationsSlice"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface Room {
  id: string
  type: string
  price: number
  available: boolean
  description: string
  amenities: string[]
  capacity: number
  bookedDates: string[]
}

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const rooms = useSelector((state: RootState) => state.rooms.rooms)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const room = rooms.find((r: Room) => r.id === id)
  if (!room) {
    return <div>Room not found</div> 
  }

  const isAvailable = (checkIn: Date | null, checkOut: Date | null): boolean => {
    if (!checkIn || !checkOut) return true
    const currentDate = new Date(checkIn)
    while (currentDate < checkOut) {
      if (isDateBooked(currentDate)) return false
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return true
  }

  const isDateBooked = (date: Date): boolean => {
    return room?.bookedDates.includes(date.toISOString().split("T")[0]) || false
  }

  const handleBooking = () => {
    if (isAuthenticated && user && checkIn && checkOut) {
      if (isAvailable(checkIn, checkOut)) {
        dispatch(
          createReservation({
            roomId: room.id,
            userId: user.id,
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
          }),
        )
        alert("Booking successful!")
        navigate("/")
      } else {
        setError("The selected dates are not available.")
      }
    } else {
      alert("Please log in to book a room")
    }
  }

  if (!room) return <div>Room not found</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{room.type}</h1>
      <p className="text-xl mb-2">${room.price} per night</p>
      <p className="mb-2">Capacity: {room.capacity} people</p>
      <p className="mb-4">{room.description}</p>
      <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
      <ul className="list-disc list-inside mb-4">
        {room.amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
      {isAuthenticated ? (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Book Now</h2>
          <div className="mb-4">
            <label className="block mb-2">Check-in Date:</label>
            <DatePicker
              selected={checkIn}
              onChange={(date: Date) => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              inline
              className="border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Check-out Date:</label>
            <DatePicker
              selected={checkOut}
              onChange={(date: Date) => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
              inline
              className="border rounded p-2"
            />
          </div>
          {checkIn &&
            checkOut &&
            (isAvailable(checkIn, checkOut) ? (
              <button
                onClick={handleBooking}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Book Now
              </button>
            ) : (
              <p className="text-red-500 font-bold">{error || "This room is not available for the selected dates."}</p>
            ))}
        </div>
      ) : (
        <p className="text-red-500 font-bold">Please log in to book this room.</p>
      )}
    </div>
  )
}

export default RoomDetailsPage
