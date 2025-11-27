import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirmPassword: '',
  });

  // Check for token on mount
  useEffect(() => {
    const token = sessionStorage.getItem('resetToken');
    if (!token) {
      navigate('/verify-otp');
    }
  }, [navigate]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(resetPassword.password)) {
      setError(
        'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      return;
    }

    if (resetPassword.password !== resetPassword.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    const token = sessionStorage.getItem('resetToken');

    try {
      const response = await fetch('http://localhost:5000/api/password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: resetPassword.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem('resetToken');
        window.location.href = '/login';
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="mt-2 text-gray-600">
              Create a strong password for your account
            </p>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={resetPassword.password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                  <KeyRound className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={resetPassword.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                  <KeyRound className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading || !resetPassword.password || !resetPassword.confirmPassword
              }
              className="w-full mt-6 bg-indigo-600 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
