import React, { useState, useEffect } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://salesforce-hackathon-s8mr.onrender.com/room');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const filteredRooms = rooms.filter(room => {
    const matchesName = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!fromTime && !toTime) return matchesName;
    if (!room.availableTimes || room.availableTimes.length === 0) return false;

    const fromMins = timeToMinutes(fromTime);
    const toMins = timeToMinutes(toTime);

    const timeMatches = room.availableTimes.some(({ start, end }) => {
      const startMins = timeToMinutes(start);
      const endMins = timeToMinutes(end);

      if (fromMins != null && toMins != null) {
        return startMins < toMins && endMins > fromMins;
      } else if (fromMins != null) {
        return endMins > fromMins;
      } else if (toMins != null) {
        return startMins < toMins;
      }
      return false;
    });

    return matchesName && timeMatches;
  });

  return (
    <div className="pt-20">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center h-[300px] md:h-[400px] flex flex-col items-center justify-center text-white px-4"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center max-w-xl w-full space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Available Rooms</h1>
          <input
            type="text"
            placeholder="Search rooms by name..."
            className="w-full px-4 py-2 bg-white rounded shadow focus:outline-none text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex justify-center gap-4">
            <div className="flex flex-col ">
              <label htmlFor="fromTime text-white" className="mb-1 font-semibold">From Time</label>
              <input
                id="fromTime"
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="px-4 py-2 text-black bg-white rounded shadow focus:outline-none"
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="toTime text-white" className="mb-1 font-semibold">To Time</label>
              <input
                id="toTime"
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="px-4 py-2 text-black bg-white rounded shadow focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Book a Room Heading */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <h1 className="flex items-center text-3xl font-bold text-[#575B91] mb-6">
          <FaCirclePlus className="mr-3 text-[#575B91]" size={32} />
          Book a Room
        </h1>
      </section>

      {/* Rooms Grid */}
      <section className="px-4 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <div
                key={room.id}
                className="bg-[#F6F7FB] p-6 h-[220px] shadow rounded flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#333]">{room.name}</h3>
                  <p className="text-gray-600 mb-2">Capacity: {room.capacity}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm px-4 py-2 bg-white font-bold rounded-2xl text-[#575B91] border border-[#575B91]">
                    {room.amenities.length} Amenities
                  </p>
                  <div className="text-right text-sm text-gray-500">
                    {room.amenities.join(', ')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No rooms found matching your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
