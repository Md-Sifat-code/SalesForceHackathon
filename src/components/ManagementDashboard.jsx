import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const ManagementDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingEquipment, setLoadingEquipment] = useState(true);

  // Fetch all rooms data (booked + available)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          "https://salesforce-hackathon-s8mr.onrender.com/api/bookings/rooms"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // Fetch booked equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          "https://salesforce-hackathon-s8mr.onrender.com/api/bookings/equipment/booked"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch equipment");
        }
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoadingEquipment(false);
      }
    };

    fetchEquipment();
  }, []);

  // Room stats
  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter((room) => room.isBooked).length;
  const chartData = [
    { name: "Booked Rooms", count: bookedRooms },
    { name: "Available Rooms", count: totalRooms - bookedRooms },
  ];

  // Equipment booking frequency by type
  const equipmentTypeCounts = equipment.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const equipmentChartData = Object.entries(equipmentTypeCounts).map(
    ([type, count]) => ({
      type,
      count,
    })
  );

  if (loadingRooms || loadingEquipment) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-bold text-[#575B91]">Management Dashboard</h1>

      {/* Room Bar Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Room Booking Overview</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#575B91" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Equipment Line Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Equipment Booking Trends</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={equipmentChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Details Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Room Details</h2>
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Room ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Capacity</th>
              <th className="border border-gray-300 px-4 py-2">Booked</th>
              <th className="border border-gray-300 px-4 py-2">Amenities</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{room.id}</td>
                <td className="border border-gray-300 px-4 py-2">{room.name}</td>
                <td className="border border-gray-300 px-4 py-2">{room.capacity}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {room.isBooked ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {room.amenities1?.join(", ") || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagementDashboard;
