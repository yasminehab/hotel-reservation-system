import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setRooms, setLoading, setError } from '../store/roomSlice';
import RoomCard from '../components/RoomCard';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state: RootState) => state.rooms);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [roomType, setRoomType] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'type'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchRooms = async () => {
      dispatch(setLoading(true));
      try {
        const mockRooms = [
          {
            id: '1',
            type: 'Single',
            price: 100,
            available: true,
            booked: false,
            description: 'A cozy single room with modern amenities, perfect for solo travelers.',
            amenities: ['Wi-Fi', 'TV', 'Air Conditioning'],
            capacity: 1,
            bookedDates: [], 

          },
          {
            id: '2',
            type: 'Double',
            price: 150,
            available: true,
            booked: false,
            description: 'Spacious double room with a comfortable bed and a work desk, ideal for couples or business travelers.',
            amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar'],
            capacity: 2,
            bookedDates: [], 

          },
          {
            id: '3',
            type: 'Suite',
            price: 250,
            available: true,
            booked: false,
            description: 'Luxurious suite with a separate living area and stunning city views, perfect for those seeking extra comfort.',
            amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi'],
            capacity: 4,
                bookedDates: [],

          },
        ];
        dispatch(setRooms(mockRooms));
      } catch (err) {
        dispatch(setError('Failed to fetch rooms'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRooms();
  }, [dispatch]);

  const filteredAndSortedRooms = rooms
    .filter(
      (room) =>
        room.price <= priceRange &&
        (roomType === '' || room.type === roomType)
    )
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
    });

  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap">
            <h2 className="text-xl font-semibold text-gray-800 mr-4">Book your next stay</h2>
            <div className="flex items-center space-x-2 flex-grow md:flex-grow-0">
              <div className="flex bg-white rounded-md overflow-hidden border border-gray-300">
                <div className="flex items-center px-2 text-gray-500">
                  <Calendar size={20} />
                </div>
                <DatePicker
                  selected={checkInDate}
                  onChange={(date: Date | null) => setCheckInDate(date)}
                  selectsStart
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  placeholderText="Check-in"
                  minDate={today}  
                  className="w-28 p-2 text-sm text-gray-900 outline-none border-r border-gray-200"
                />
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date: Date | null) => setCheckOutDate(date)}
                  selectsEnd
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={checkInDate || today}  
                  placeholderText="Check-out"
                  className="w-28 p-2 text-sm text-gray-900 outline-none"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
            <h2 className="text-2xl font-semibold mb-4">Filters</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range: Up to ${priceRange}</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type:</label>
              <select 
                value={roomType} 
                onChange={(e) => setRoomType(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By:</label>
              <select 
                value={`${sortBy}-${sortOrder}`} 
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as ['price' | 'type', 'asc' | 'desc'];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="type-asc">Room Type (A to Z)</option>
                <option value="type-desc">Room Type (Z to A)</option>
              </select>
            </div>
          </div>

          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center text-xl mt-10">{error}</div>
            ) : (
              <div className="space-y-6">
                {filteredAndSortedRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
                {filteredAndSortedRooms.length === 0 && (
                  <p className="text-center text-gray-500 mt-10">No rooms match your current filters.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
