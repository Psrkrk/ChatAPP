import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiLock, FiRefreshCw, FiArrowRight } from 'react-icons/fi';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const updatedOtp = [...otp];
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (otpCode.length !== 6) {
      toast.error('Please enter the full OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/verify-otp', {
        email,
        otp: otpCode,
      });

      toast.success(response.data.message || 'OTP verified');
      navigate('/create-new-password');
    } catch (error) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email to resend OTP.');
      return;
    }

    setResendDisabled(true);
    setTimer(60);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/send-otp', { email });
      toast.success(response.data.message || 'OTP resent successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
          >
            <FiLock className="w-6 h-6 text-indigo-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
          <p className="text-gray-500">We'll send a 6-digit code to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none"
          />

          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-16 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.some((digit) => digit === '') || !email}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
            }`}
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                Verify Code <FiArrowRight className="ml-2" />
              </>
            )}
          </button>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled || !email}
              className={`flex items-center text-sm font-medium ${
                resendDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              <FiRefreshCw className={`mr-2 ${resendDisabled ? 'animate-pulse' : ''}`} />
              {resendDisabled ? `Resend code in ${timer}s` : 'Resend code'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VerifyOTP;
