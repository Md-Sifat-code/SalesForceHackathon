import React, { useEffect, useState } from "react";
import { FaToolbox, FaMicrochip, FaLaptop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import { MdOutlineDevicesOther } from "react-icons/md";

function Equipments() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon map based on equipment type
  const getIconByType = (type) => {
    const iconSize = 28;
    switch (type?.toLowerCase()) {
      case "tablet":
        return <FaTabletAlt size={iconSize} className="text-purple-700" />;
      case "smartphone":
        return <FaMobileAlt size={iconSize} className="text-purple-700" />;
      case "portable projector":
        return <FaLaptop size={iconSize} className="text-purple-700" />;
      case "vcu type a":
      case "vcu type b":
        return <FaMicrochip size={iconSize} className="text-purple-700" />;
      case "smartboard":
        return <FaToolbox size={iconSize} className="text-purple-700" />;
      default:
        return <MdOutlineDevicesOther size={iconSize} className="text-purple-700" />;
    }
  };

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await fetch(
          "https://salesforce-hackathon-s8mr.onrender.com/api/bookings/equipment"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEquipments(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  if (loading) return <div className="p-4">Loading equipments...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      <h1 className="text-3xl font-bold text-[#575B91] mb-8">Available Equipments</h1>

      {equipments.length === 0 ? (
        <p className="text-gray-500">No equipment found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <div
              key={equipment.id || equipment._id}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  {getIconByType(equipment.type)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {equipment.name || "Unnamed Equipment"}
                  </h2>
                  <p className="text-sm text-gray-500">{equipment.type || "Unknown Type"}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Serial No:</strong> {equipment.serialNumber || "N/A"}</p>
                <p><strong>Booked:</strong> {equipment.isBooked ? "Yes" : "No"}</p>
                {equipment.description && (
                  <p><strong>Description:</strong> {equipment.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Equipments;
