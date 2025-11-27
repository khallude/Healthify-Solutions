import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Mail, AlertCircle } from "lucide-react";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    setError("");

    if (element.value && index < 5) {
      const nextInput = element.parentElement?.nextElementSibling?.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector("input");
      if (prevInput) {
        prevInput.focus();
        setOtp([...otp.map((d, idx) => (idx === index - 1 ? "" : d))]);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/password/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp.join("") }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("resetToken", otp.join(""));
        navigate("/resetforgetpassword");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <p>Enter the code sent to your email</p>
            </div>
            <div className="mt-2 text-sm text-indigo-600 font-medium">
              Time remaining: {formatTime(timeLeft)}
            </div>
          </div>

          <form onSubmit={handleVerifyOTP}>
            <div className="flex gap-2 justify-center mb-8">
              {otp.map((digit, index) => (
                <div key={index} className="w-12">
                  <input
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.some((digit) => !digit) || timeLeft <= 0}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{" "}
              <button
                className="text-indigo-600 font-medium hover:text-indigo-700 focus:outline-none"
                onClick={() => {
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                  setTimeLeft(900);
                }}
              >
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
