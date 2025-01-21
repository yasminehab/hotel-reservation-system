import React from "react";
import { Link } from "react-router-dom";
import type { Room } from "../store/roomSlice";

const resetTimeToLocalMidnight = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); 
  return newDate;
};

const isRoomUnavailable = (bookedDates: Date[], checkIn: Date, checkOut: Date) => {
  const checkDates: Date[] = [];
  let currentDate = new Date(checkIn);

  while (currentDate <= checkOut) {
    checkDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return checkDates.some((checkDate) =>
    bookedDates.some((bookedDate) => resetTimeToLocalMidnight(checkDate).getTime() === resetTimeToLocalMidnight(bookedDate).getTime())
  );
};

const RoomCard: React.FC<Room> = ({ id, type, price, available, description, amenities, bookedDates }) => {
  const checkIn = new Date(); 
  const checkOut = new Date(); 
  
  const bookedDatesAsDates = bookedDates.map(date => new Date(date));

  const isUnavailable = isRoomUnavailable(bookedDatesAsDates, checkIn, checkOut);

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
        isUnavailable ? "bg-gray-300" : "" 
      }`}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{type}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Amenities:</h4>
          <ul className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <li key={index} className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                {amenity}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-blue-600">
            ${price} <span className="text-sm text-gray-500">per night</span>
          </p>
          <Link
            to={`/room/${id}`}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${
              isUnavailable ? "cursor-not-allowed opacity-50" : ""
            }`}
            aria-disabled={isUnavailable}
          >
            {isUnavailable ? "Booked" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
