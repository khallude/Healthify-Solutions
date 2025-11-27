import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/api';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const tempToken = localStorage.getItem('tempToken');
    if (!tempToken) {
      navigate('/login');
      return;
    }
    
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus on the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      // Use the auth service to verify OTP
      const response = await authService.verifyOTP(otpValue, tempToken);

      if (response.data.token) {
        setSuccess(true);
        // Remove temp token and store the permanent token
        localStorage.removeItem('tempToken');
        localStorage.setItem('token', response.data.token);
        
        // Redirect after showing success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to verify OTP.');
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendDisabled(true);
    setCountdown(60);
    
    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      // Use the auth service to resend OTP
      await authService.resendOTP(tempToken);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to resend OTP.');
      } else {
        setError('Network error. Please try again later.');
      }
    }
    
    // Start countdown again
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const goBack = () => {
    localStorage.removeItem('tempToken');
    navigate('/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Successful</h2>
          <p className="text-gray-600 mb-4">You are being redirected to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <button 
          onClick={goBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Login
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendDisabled}
            className={`mt-2 text-blue-600 hover:text-blue-800 ${
              resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;