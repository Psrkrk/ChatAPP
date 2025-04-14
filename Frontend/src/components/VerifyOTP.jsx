import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const SendOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/verify-otp', { email, otp });
      toast.success(response.data.message);
      Cookies.set('resetEmail', email, { expires: 1/144 });
      navigate('/create-new-password'); // Redirect to chat page or wherever after OTP verification
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimer(60);

    try {
      // You can integrate OTP send logic here or call your OTP API for resend
      await axios.post('http://localhost:5000/api/v1/send-otp', { email });
      toast.success('OTP sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">Verify OTP</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white bg-indigo-600 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`text-sm text-indigo-600 hover:text-indigo-700 ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Resend OTP ({timer}s)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendOtp;
