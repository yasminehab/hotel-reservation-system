import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { removeReservation } from "../store/reservationsSlice"

const UserDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { reservations } = useSelector((state: RootState) => state.reservations)
  const { rooms } = useSelector((state: RootState) => state.rooms)

  const userReservations = reservations.filter((res) => res.userId === user?.id)

  const handleCancelReservation = (id: string) => {
    dispatch(removeReservation(id))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Reservations</h1>
      {userReservations.length === 0 ? (
        <p>You have no reservations.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userReservations.map((reservation) => {
            const room = rooms.find((r) => r.id === reservation.roomId)

            if (!room) {
              return (
                <div key={reservation.id} className="border rounded-lg p-4 shadow-md">
                  <h3 className="text-xl font-semibold">Room Not Found</h3>
                  <p>Details for this reservation are unavailable.</p>
                </div>
              )
            }

            return (
              <div key={reservation.id} className="border rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold">{room.type}</h3>
                <p>Check-in: {formatDate(reservation.checkIn)}</p>
                <p>Check-out: {formatDate(reservation.checkOut)}</p>
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel Reservation
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserDashboard
