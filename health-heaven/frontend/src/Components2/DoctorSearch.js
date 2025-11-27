import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Clock, DollarSign, Award, Loader2 } from 'lucide-react';

const DoctorSearch = () => {
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); // Pagination state
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://localhost:5000/api/doctors?specialty=${specialty}&page=${page}`
      );
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate('/appointment-scheduler');
  };

  const handleNextPage = () => setPage(page + 1);
  const handlePreviousPage = () => setPage(Math.max(page - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find Your Doctor</h2>
          <div className="max-w-xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by specialty (e.g., Cardiology, Pediatrics)"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                aria-label="Search doctors by specialty"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-center py-4">
            {error}
          </div>
        )}

        {/* Results Section */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        )}

        {doctors.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Available Doctors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{doctor.specialty}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>₹{doctor.consultationFees}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{doctor.experience} years</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Available Times</h5>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availableTimes.slice(0, 3).map((time, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                          >
                            {time}
                          </span>
                        ))}
                        {doctor.availableTimes.length > 3 && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md">
                            +{doctor.availableTimes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleBookAppointment}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {doctors.length === 0 && !loading && specialty && (
          <div className="text-center py-12">
            <p className="text-gray-600">No doctors found for the specified specialty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
