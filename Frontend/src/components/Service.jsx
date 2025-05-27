import React from "react";
import { FaCamera, FaCannabis, FaRandom } from "react-icons/fa";
import Header from "./Header";

const Service = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600">
            Assumenda non repellendus distinctio nihil dicta sapiente,
            quibusdam maiores, illum at, aliquid blanditiis eligendi qui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-100 text-red-500 text-3xl mx-auto mb-6">
              <FaCannabis />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Branding</h4>
            <p className="text-gray-600">
              Assumenda non repellendus distinctio nihil dicta sapiente,
              quibusdam maiores, illum at, aliquid blanditiis eligendi qui.
            </p>
          </div>

          {/* Content Marketing */}
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-100 text-blue-500 text-3xl mx-auto mb-6">
              <FaRandom />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Content Marketing</h4>
            <p className="text-gray-600">
              It’s easier to reach your savings goals when you have the right
              savings account.
            </p>
          </div>

          {/* Web Development */}
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-500 text-3xl mx-auto mb-6">
              <FaCamera />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Web Development</h4>
            <p className="text-gray-600">
              Sed ut in perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
