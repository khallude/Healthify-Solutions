import React, { useState } from 'react';
import { DoctorFormData, specialties } from '../types/doctor';
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialFormData: DoctorFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  specialty: "",
  experience: 0,
  hospitalAffiliation: "",
  certificateUrl: "",
  govIDUrl: "",
  profilePictureUrl: "",
  fees: 0,
  location: "",
};
const DoctorRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DoctorFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof DoctorFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DoctorFormData, string>> = {};
    let isValid = true;

    // Personal Information validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Professional Details validation
    if (!formData.specialty) {
      newErrors.specialty = "Specialty is required";
      isValid = false;
    }

    if (formData.experience < 0) {
      newErrors.experience = "Experience cannot be negative";
      isValid = false;
    }

    if (!formData.hospitalAffiliation.trim()) {
      newErrors.hospitalAffiliation = "Hospital affiliation is required";
      isValid = false;
    }

    if (formData.fees < 0) {
      newErrors.fees = "Consultation fees cannot be negative";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Practice location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'fees' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DoctorFormData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file, // Store actual file object
      }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName ?? "");
      formDataToSend.append("email", formData.email ?? "");
      formDataToSend.append("phone", formData.phone ?? "");
      formDataToSend.append("password", formData.password ?? "");
      formDataToSend.append("specialty", formData.specialty ?? "");
      formDataToSend.append("experience", String(formData.experience ?? 0));
      formDataToSend.append("fees", String(formData.fees ?? 0));
      formDataToSend.append("location", formData.location ?? "");
      formDataToSend.append("hospitalAffiliation", formData.hospitalAffiliation ?? "");
  
      // Append optional files
      if (formData.profilePictureUrl) {
        formDataToSend.append("profilePicture", formData.profilePictureUrl);
      }
      if (formData.certificateUrl) {
        formDataToSend.append("certificate", formData.certificateUrl);
      }
      if (formData.govIDUrl) {
        formDataToSend.append("govID", formData.govIDUrl);
      }
  
      // Log FormData content for debugging
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await fetch("http://localhost:5000/api/doctor/register-doctor", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }
  
      const result = await response.json();
      console.log("Registration successful:", result);
      setIsSuccess(true);
      navigate("/Doctorlogin");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for registering, Dr. {formData.fullName}. Your application has been submitted for review.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          Register Another Doctor
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Doctor Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Dr. John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="doctor@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Medical Specialty
              </label>
              <select
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.specialty ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              {errors.specialty && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.specialty}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.experience}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fees ($)
              </label>
              <input
                type="number"
                id="fees"
                name="fees"
                min="0"
                value={formData.fees}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fees ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="100"
              />
              {errors.fees && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.fees}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Practice Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="New York, NY"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.location}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Affiliation
              </label>
              <input
                type="text"
                id="hospitalAffiliation"
                name="hospitalAffiliation"
                value={formData.hospitalAffiliation}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.hospitalAffiliation ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="City General Hospital"
              />
              {errors.hospitalAffiliation && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.hospitalAffiliation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Documentation</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {formData.profilePictureUrl ? (
                  <img 
                    src={formData.profilePictureUrl} 
                    alt="Profile Preview" 
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePictureUrl')}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Certificate
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG or JPG (MAX. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e, 'certificateUrl')}
                  />
                </label>
              </div>
              {formData.certificateUrl && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Certificate uploaded successfully
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Government ID
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG or JPG (MAX. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e, 'govIDUrl')}
                  />
                </label>
              </div>
              {formData.govIDUrl && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Government ID uploaded successfully
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Important Information</h3>
          <p className="text-sm text-blue-700">
            By submitting this form, you confirm that all information provided is accurate and complete. 
            Your application will be reviewed by our team, and you will be notified once your account is approved.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorRegistrationForm;