import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('http://localhost:5000/users/user-details', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(response.data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      <p className="mt-4">Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  );
};

export default Profile;
