// DoctorLogin.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface DoctorLoginData {
  email: string;
  password: string;
}

const DoctorLogin: React.FC = () => {
  const [formData, setFormData] = useState<DoctorLoginData>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigation

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    setError(null); // Clear errors if valid
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();
      console.log("Doctor login successful:", result);

      // Store token in localStorage with a consistent key
      localStorage.setItem("token", result.token);

      // Navigate to Dashboard with correct path
      // navigate("/dashboard");
      navigate("/layout");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Doctor Login</h2>

        {error && (
          <div className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 rounded-lg text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/doctorregistration" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
