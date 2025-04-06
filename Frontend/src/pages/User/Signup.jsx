import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

// Reusable form component
const SignUpForm = ({ onSuccess }) => (
  <form
    className="mt-4"
    onSubmit={(e) => {
      e.preventDefault();
      onSuccess(); // simulate registration success
    }}
  >
    <div className="mb-4">
      <input
        type="text"
        className="w-full bg-white min-h-[48px] px-4 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-600"
        placeholder="Enter your name"
      />
    </div>
    <div className="mb-4">
      <input
        type="email"
        className="w-full bg-white min-h-[48px] px-4 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-600"
        placeholder="Enter your email"
      />
    </div>
    <div className="mb-4">
      <input
        type="password"
        className="w-full bg-white min-h-[48px] px-4 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-600"
        placeholder="Enter your password"
      />
    </div>
    <button
      type="submit"
      className="bg-blue-600 text-white font-bold py-3 px-8 rounded w-full"
    >
      Register
    </button>
    <div className="text-center mt-5">
      <p>
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log In
        </a>
      </p>
    </div>
  </form>
);

// Profile preview after signup
const Profile = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center text-center p-6">
      <img
        src="https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_2.jpeg"
        alt="User"
        className="rounded-full w-24 h-24 mb-4"
      />
      <h2 className="text-2xl font-bold mb-1">Welcome, John Doe</h2>
      <p className="text-gray-600">john@example.com</p>
    </div>
  );
};

const Signup = () => {
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleRegisterSuccess = () => {
    setShowForm(false);
    setShowProfile(true);
  };

  return (
    <>
      {!showProfile && (
        <section className="bg-white py-11">
          <div className="container mx-auto px-4">
            <button
              className="bg-blue-600 text-white hover:bg-opacity-90 py-2 px-4 rounded"
              onClick={() => setShowForm(true)}
            >
              Sign Up
            </button>
          </div>
        </section>
      )}

      {showForm && (
        <div className="bg-white text-zinc-900 relative max-w-[90vw] sm:max-w-[40vw] mx-auto my-14 p-10 border rounded shadow">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={() => setShowForm(false)}
          >
            <IoCloseSharp size={22} />
          </button>

          <div className="flex flex-col items-center">
            <img
              src="https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_2.jpeg"
              alt="User"
              className="rounded-full mb-4"
              width="100"
              height="100"
            />
            <h2 className="text-3xl font-bold mb-4">Register</h2>
            <SignUpForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>
      )}

      {showProfile && <Profile />}
    </>
  );
};

export default Signup;
