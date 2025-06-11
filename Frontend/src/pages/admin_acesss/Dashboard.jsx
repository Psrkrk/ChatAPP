import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUsers, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import { fetchAdminData, fetchAllUsers } from '../../redux/adminSlice';

function Dashboard() {
  const dispatch = useDispatch();

  // Select state from Redux
  const { adminData, users, loading, error } = useSelector((state) => state.admin);
  const token = useSelector((state) => state.auth.user?.token); // Adjust based on your authSlice

  useEffect(() => {
    if (token) {
      dispatch(fetchAdminData(token));
      dispatch(fetchAllUsers(token));
    }
  }, [dispatch, token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="text-xl font-semibold text-gray-800">{users?.length || 0}</h3>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
          <FaMoneyBillWave className="text-green-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <h3 className="text-xl font-semibold text-gray-800">
              ${adminData?.revenue || 'N/A'}
            </h3>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
          <FaChartLine className="text-purple-500 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Performance</p>
            <h3 className="text-xl font-semibold text-gray-800">
              {adminData?.performance || 'N/A'}%
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-gray-500">[ Chart Component Coming Soon ]</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 h-64 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {users.slice(0, 5).map((user) => (
              <li key={user._id}>👤 {user.fullname || user.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
