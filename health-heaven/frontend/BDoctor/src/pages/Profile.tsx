import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, Building, Award, Save } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 
        console.log("Retrieved Token:", token); // Debugging log
  
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
  
        const response = await fetch("http://localhost:5000/api/doctor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        console.log("Response Status:", response.status); 
      
        // Debugging log
  
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
  
        const data = await response.json();
        console.log("Fetched Profile Data:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error Fetching Profile:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return <p className="text-center text-gray-600">No profile data available.</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
            <div className="relative">
              <img
                src={profile.profilePictureUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="pb-4">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-blue-100">{profile.specialization}</p>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-600">{profile.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-600">{profile.phone}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-600">{profile.location}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Hospital Affiliation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.hospitalAffiliation}
                      onChange={(e) => setProfile({ ...profile, hospitalAffiliation: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-600">{profile.hospitalAffiliation}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
