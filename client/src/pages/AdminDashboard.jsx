import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(""); // Default radius
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/allusers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const fetchedUsers = Array.isArray(response.data) ? response.data : [];
        setUserCount(fetchedUsers.length);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Automatically get the current location on component mount

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude.toFixed(6)); // Format to 6 decimal places
            setLongitude(position.coords.longitude.toFixed(6));
          },
          (error) => {
            console.error("Error getting location:", error);
            setMessage(
              "Unable to retrieve location. Please allow location access."
            );
          }
        );
      } else {
        setMessage("Geolocation is not supported by this browser.");
      }
    };

    fetchAdminData();
    getLocation();
  }, []);

  const handleSetLocation = async () => {
    if (!latitude || !longitude || !radius) {
      setMessage("Please fill in all fields.");
      return;
}

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/setPermittedLocation",
        {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radiusInMeters: parseInt(radius, 10),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data);
      setMessage(response.data.message);

      setIsPopupOpen(false); 
    } catch (error) {
      console.error("Error setting location:", error);
      setMessage("Failed to set permitted location");
    }
  };

  // Add handlers for "Edit", "Delete", and "See Attendance"
  const handleEdit = (userId) => {
    console.log("Edit user with ID:", userId);
    // You can implement the logic for editing the user details
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter(user => user._id !== userId)); // Remove deleted user from state
      setMessage("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Failed to delete user");
    }
  };

  const handleSeeAttendance = (userId) => {
    console.log("See attendance for user with ID:", userId);
    // You can implement the logic for viewing attendance
  };

  return (
    <div className="p-6">
      <div className=" font-bold flex justify-between items-center">
        <p className="text-xl">Admin Dashbaord</p>
        <button
          onClick={() => setIsPopupOpen(true)} // Open the popup
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Set Permitted Location
        </button>
      </div>
      <p className="mt-4">Total Users: {userCount}</p>



      {/* User Table */}
      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-semibold">User List:</h3>
        <table className="md:min-w-full min-w-[750px] mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">S.No</th> {/* S.No Column */}
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-4 py-2 text-center">Email</th>
              <th className="border px-4 py-2 text-center">Role</th>
              <th className="border px-4 py-2 text-center">Actions</th> {/* Actions Column */}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td> {/* Displaying Serial Number */}
                  <td className="border px-4 py-2 text-center">{user.name}</td>
                  <td className="border px-4 py-2 text-center">{user.email}</td>
                  <td className="border px-4 py-2 text-center">{user.role}</td>
                  <td className="border px-4 py-2 text-center">
                    {/* Action buttons */}
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSeeAttendance(user._id)}
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      See Attendance
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup for Setting Location */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Set Permitted Location</h3>
            <div className="mt-4">
              <label className="block mb-2">Latitude:</label>
              <input
                type="text"
                value={latitude}
                readOnly
                className="border px-4 py-2 rounded w-full bg-gray-100"
                placeholder="Latitude will be fetched automatically"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Longitude:</label>
              <input
                type="text"
                value={longitude}
                readOnly
                className="border px-4 py-2 rounded w-full bg-gray-100"
                placeholder="Longitude will be fetched automatically"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Radius (meters):</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="border px-4 py-2 rounded w-full"
                placeholder="Enter radius in meters"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsPopupOpen(false)} // Close the popup
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSetLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
            {message && (
              <p
                className={`mt-4 ${
                  message.includes("Failed") || message.includes("Unable")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
