import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiExternalLink } from "react-icons/fi";
import { MdWorkOutline, MdLocationOn } from "react-icons/md";
import { FaStar, FaHome, FaCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ConnectedProf = ({ onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the recipientId from URL parameters
  const { recipientId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!recipientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://flatelse-1mup.onrender.com/User/${recipientId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [recipientId]);

  if (loading) {
    return (
      <div className="w-full h-full bg-white shadow-md p-4 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="rounded-full bg-gray-200 h-16 w-16 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2 w-full">
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="w-full bg-white shadow-md p-4">
        <div className="text-center text-red-500">
          <p>{error || "No user selected or available"}</p>
          <p className="mt-2 text-xs text-gray-500">
            Please select a conversation to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 py-2 px-3 text-white">
        <h2 className="text-sm font-semibold">About User</h2>
      </div>

      {/* Profile section with user image and basic details */}
      <div className="px-4 pt-4 pb-2 flex items-center">
        <div className="mr-3">
          {userData.profilpic ? (
            <img
              src={userData.profilpic}
              alt={userData.fullname}
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/60?text=User";
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
              <FiUser size={30} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-bold text-gray-800 mr-1">
              {userData.fullname}
            </h3>
            <FaCircle className="text-green-500 text-[6px]" title="Online" />
          </div>
          <p className="text-xs text-gray-500">@{userData.username}</p>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center text-xs">
              <FaStar className="text-yellow-500 mr-0.5 text-[10px]" />
              <span className="font-medium">4.8</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <FaHome className="mr-0.5 text-[10px]" />
              <span>{userData.propertyAdded || 0} listings</span>
            </div>
          </div>
        </div>
      </div>

      {/* User details */}
      <div className="px-4 py-2 space-y-2.5 text-xs">
        {userData.profession && (
          <div className="flex items-center text-gray-700">
            <MdWorkOutline className="text-teal-600 mr-1.5 text-sm flex-shrink-0" />
            <span className="truncate">{userData.profession}</span>
          </div>
        )}

        <div className="flex items-center text-gray-700">
          <FiMail className="text-teal-600 mr-1.5 text-sm flex-shrink-0" />
          <span className="truncate">{userData.email}</span>
        </div>

        {userData.phone && (
          <div className="flex items-center text-gray-700">
            <FiPhone className="text-teal-600 mr-1.5 text-sm flex-shrink-0" />
            <span className="truncate">{userData.phone}</span>
          </div>
        )}

        {userData.address && (
          <div className="flex items-start text-gray-700">
            <MdLocationOn className="text-teal-600 mr-1.5 text-sm mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{userData.address}</span>
          </div>
        )}
      </div>

      {/* Bio section */}
      {userData.bio && (
        <div className="px-4 py-2">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-gray-700 text-xs line-clamp-3 italic">
              {userData.bio}
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2">
        <a
          href={`/seller/${userData.username}`}
          className="py-1.5 bg-teal-600 text-white rounded text-center text-xs font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
        >
          <FiExternalLink className="mr-1" size={12} />
          Full Profile
        </a>
        <a
          href={`mailto:${userData.email}`}
          className="py-1.5 bg-gray-100 text-gray-800 rounded text-center text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <FiMail className="mr-1" size={12} />
          Email
        </a>
      </div>
    </div>
  );
};

export default ConnectedProf;