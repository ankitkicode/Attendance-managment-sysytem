import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [attendance, setAttendance] = useState([]);

  const handleCheckIn = async () => {
    const { coords } = await getLocation();
    await axios.post(
      'http://localhost:5000/attendance/check-in',
      { latitude: coords.latitude, longitude: coords.longitude },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    fetchAttendance();
  };

  const handleCheckOut = async () => {
    const { coords } = await getLocation();
    await axios.post(
      'http://localhost:5000/attendance/check-out',
      { latitude: coords.latitude, longitude: coords.longitude },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    const response = await axios.get('http://localhost:5000/attendance/get-attendance-by-userId', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    console.log(response.data);
    setAttendance(response.data);
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">User Dashboard</h2>
      <div className="mt-6">
        <button
          className="bg-green-500 text-white px-4 py-2 text-center rounded"
          onClick={handleCheckIn}
        >
          Check-In
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded ml-4"
          onClick={handleCheckOut}
        >
          Check-Out
        </button>
      </div>
      <div className="mt-6">
  <h3 className="text-lg font-semibold">Attendance Records:</h3>
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full mt-4 border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-center">S.No</th>
          <th className="border px-4 py-2 text-center">Check-in Time</th>
          <th className="border px-4 py-2 text-center">Check-out Time</th>
        </tr>
      </thead>
      <tbody>
        {attendance.length > 0 ? (
          attendance.map((record, index) => (
            <tr key={record._id}>
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-center">
                {new Date(record.checkInTime).toLocaleString()}
              </td>
              <td className="border px-4 py-2 text-center">
                {record.checkOutTime
                  ? new Date(record.checkOutTime).toLocaleString()
                  : 'Not Checked Out'}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center text-gray-500 py-4">
              No attendance records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default UserDashboard;
