import React, { useState, useEffect, useRef } from 'react';
import { FaCircleChevronRight, FaCircleChevronLeft } from 'react-icons/fa6';

const UserDashboard = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://salesforce-hackathon-s8mr.onrender.com/api/bookings/rooms');
        const data = await response.json();
        setAvailableRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        const response = await fetch('https://salesforce-hackathon-s8mr.onrender.com/api/bookings/rooms/booked');
        const data = await response.json();

        const meetings = data.map((room) => ({
          id: room.id,
          title: `Meeting in ${room.name}`,
          time: `Scheduled time TBD`,
          room: `${room.name} (Capacity: ${room.capacity})`,
          attendees: ['/user1.png', '/user2.png', '/user3.png'],
        }));

        setUpcomingMeetings(meetings);
      } catch (error) {
        console.error('Error fetching upcoming meetings:', error);
      }
    };

    fetchUpcomingMeetings();
  }, []);

  const filteredRooms = Array.isArray(availableRooms)
    ? availableRooms.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center h-[200px] md:h-[300px] flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Welcome to Your Dashboard</h1>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search available rooms..."
              className="w-full px-4 bg-white py-2 rounded shadow focus:outline-none text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-[#575B91]">Upcoming Meetings</h2>
          <button className="bg-[#575B91] text-white px-4 py-2 rounded hover:bg-[#46497a] transition">
            Open a Meeting
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingMeetings.length === 0 && <p>No upcoming meetings found.</p>}
          {upcomingMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-purple-900 p-6 h-[200px] shadow rounded flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{meeting.title}</h3>
                <p className="text-gray-400">{meeting.time}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm px-4 py-2 bg-white font-bold rounded-2xl text-purple-900">
                  {meeting.room}
                </p>
                <div className="flex -space-x-3">
                  {meeting.attendees.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`attendee-${index}`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Rooms */}
      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-[#575B91]">Available Rooms</h2>
          <button className="bg-[#575B91] text-white px-4 py-2 rounded hover:bg-[#46497a] transition">
            Book a Room
          </button>
        </div>

        <div className="relative">
          {/* Scroll Left Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
          >
            <FaCircleChevronLeft className="text-[#575B91] text-2xl" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pr-4 hide-scrollbar scroll-smooth"
          >
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-[#F6F7FB] p-6 min-w-[40%] max-w-[300px] h-[200px] shadow rounded flex flex-col justify-between shrink-0"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#333]">{room.name}</h3>
                  <p className="text-gray-600">Capacity: {room.capacity}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm px-4 py-2 bg-white font-bold rounded-2xl text-[#575B91] border border-[#575B91]">
                    {Array.isArray(room.amenities) ? room.amenities.length : 0} Amenities
                  </p>
                  <div className="text-right text-sm text-gray-500">
                    {Array.isArray(room.amenities) ? room.amenities.join(', ') : 'No amenities'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
          >
            <FaCircleChevronRight className="text-[#575B91] text-2xl" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
