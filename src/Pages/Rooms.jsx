import React, { useState, useEffect } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate

const Rooms = () => {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate(); // ✅ Hook for navigation

  const [rooms, setRooms] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('https://salesforce-hackathon-s8mr.onrender.com/api/bookings/rooms');
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    const fetchEquipment = async () => {
      try {
        const res = await fetch('https://salesforce-hackathon-s8mr.onrender.com/api/bookings/equipment');
        if (!res.ok) throw new Error('Failed to fetch equipment');
        const data = await res.json();
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchRooms();
    fetchEquipment();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEquipmentForRoom = (room) => {
    if (!room.amenities1) return [];
    return equipment.filter(eq => room.amenities1.includes(eq.type));
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSelectedResourceType('');
    setSelectedResourceId('');
    setFromTime('');
    setToTime('');
    setError(null);
    setSuccessMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!user?.id) {
      setError("You must be logged in to book.");
      return;
    }

    if (!selectedResourceType || !selectedResourceId) {
      setError('Please select a room or equipment.');
      return;
    }

    if (!fromTime || !toTime) {
      setError('Please enter both start and end time.');
      return;
    }

    if (fromTime >= toTime) {
      setError('Start time must be before end time.');
      return;
    }

    setSubmitLoading(true);

    const params = new URLSearchParams({
      userId: user.id,
      resourceId: selectedResourceId,
      resourceType: selectedResourceType,
      start: fromTime,
      end: toTime,
    });

    try {
      const res = await fetch(`https://salesforce-hackathon-s8mr.onrender.com/api/bookings/book?${params.toString()}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to book');
      }

      setSuccessMessage('Booking successful!');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/home'); // ✅ Redirect to /home after success
      }, 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="pt-20">
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
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 mt-10 flex justify-between items-center">
        <h1 className="flex items-center text-3xl font-bold text-[#575B91] mb-6">
          <FaCirclePlus className="mr-3 text-[#575B91]" size={32} />
          Book a Room or Equipment
        </h1>
        <button
          onClick={openModal}
          className="bg-[#575B91] text-white px-5 py-2 rounded hover:bg-[#434772] transition"
        >
          Book Now
        </button>
      </section>

      <section className="px-4 py-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[#575B91]">Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => {
              const roomEquip = getEquipmentForRoom(room);
              return (
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
                      {roomEquip.length} Equipment
                    </p>
                    <div className="text-right text-sm text-gray-500 truncate max-w-xs">
                      {roomEquip.length > 0
                        ? roomEquip.map(eq => eq.name).join(', ')
                        : 'No equipment'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-center text-gray-500">No rooms found matching your criteria.</p>
          )}
        </div>
      </section>

      <section className="px-4 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#575B91]">Equipment</h2>
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipment.map(eq => (
              <div key={eq.id} className="bg-[#F6F7FB] p-6 shadow rounded">
                <h3 className="text-lg font-bold text-[#333]">{eq.name}</h3>
                <p className="text-gray-600">Type: {eq.type}</p>
                <p className="text-gray-600">Serial Number: {eq.serialNumber}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No equipment data available.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-[#575B91]">Book a Room or Equipment</h2>

            {userLoading ? (
              <p>Loading user info...</p>
            ) : !user ? (
              <p className="text-red-600 mb-4">You must be logged in to book.</p>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Select Type</label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => {
                    setSelectedResourceType(e.target.value);
                    setSelectedResourceId('');
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="ROOM">Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Select {selectedResourceType === 'ROOM' ? 'Room' : selectedResourceType === 'EQUIPMENT' ? 'Equipment' : 'Resource'}
                </label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  disabled={!selectedResourceType}
                >
                  <option value="">-- Select --</option>
                  {selectedResourceType === 'ROOM' && rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                  {selectedResourceType === 'EQUIPMENT' && equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">From Time</label>
                <input
                  type="datetime-local"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">To Time</label>
                <input
                  type="datetime-local"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {error && <p className="text-red-600">{error}</p>}
              {successMessage && <p className="text-green-600">{successMessage}</p>}

              <button
                type="submit"
                className="bg-[#575B91] text-white px-5 py-2 rounded w-full disabled:opacity-50"
                disabled={submitLoading || userLoading || !user}
              >
                {submitLoading ? 'Booking...' : 'Book'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
