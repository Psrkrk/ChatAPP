import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SendOTP = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value) || value === '');
    setOtpSent(false); // Reset OTP sent status when email changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      toast.error('Please enter a valid email address');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/v1/send-otp', 
        { email }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 500,
        }
      );

      // Handle both string and object responses
      let responseData = response.data;
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData);
        } catch (error) {
          console.error('Failed to parse response:', error);
          responseData = { success: false, message: responseData };
        }
      }

      if (response.status === 200 && responseData.success) {
        toast.success(responseData.message || 'OTP sent successfully!');
        setOtpSent(true);
        // Store email in session or pass it to the next route
        sessionStorage.setItem('otpEmail', email);
      } else {
        toast.error(responseData.message || 'User not found');
        setOtpSent(false);
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to send OTP. Please try again later.';
      toast.error(errorMessage);
      setOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    navigate('/verify-otp', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-indigo-100 p-4 rounded-full transition-transform duration-300 hover:scale-110">
              <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center  text-black mb-2">Verify Your Email</h2>
          <p className="text-black text-center mb-6">
            We'll send a 6-digit verification code to your email
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 rounded-lg border ${isEmailValid ? 'border-gray-300' : 'border-red-500'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
                {!isEmailValid && email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {!isEmailValid && email && (
                <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !isEmailValid}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center ${
                (isLoading || !email || !isEmailValid) ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-black">
              Are you sure change password?{' '}
              <button
                onClick={() => navigate('/verify-otp')}
                className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors"
                disabled={isLoading}
              >
                Verify Otp
              </button>
            </p>
          </div>



          <div className="mt-6 text-center">
            <p className="text-sm text-black">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendOTP;