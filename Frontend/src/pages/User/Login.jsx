import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const LoginForm = () => (
  <form className="mt-4">
    <div className="mb-4">
      <input
        type="email"
        className="w-full bg-white min-h-[48px] leading-10 px-4 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-600"
        placeholder="Enter your email"
      />
    </div>
    <div className="mb-4">
      <input
        type="password"
        className="w-full bg-white min-h-[48px] leading-10 px-4 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-600"
        placeholder="Enter your password"
      />
    </div>
    <button
      type="submit"
      className="bg-blue-600 text-white font-bold py-3 px-8 rounded w-full"
    >
      Log In
    </button>
    <div className="text-center mt-5">
      <p>
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  </form>
);

const Login = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="bg-white min-h-screen flex justify-center items-center px-4">
      {show && (
        <div className="relative w-full max-w-md bg-white border border-gray-300 p-6 rounded shadow-md">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={() => setShow(false)}
          >
            <IoMdClose size={22} />
          </button>
          <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default Login;
