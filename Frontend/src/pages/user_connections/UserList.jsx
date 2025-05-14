import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMoreVertical, FiEdit, FiSettings, FiLogOut } from "react-icons/fi";
import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import { getAllUsers } from "../../redux/userSlice";
import UserCard from "./UserCard";
import SendChat from "./SendChat";
import ReceivedChat from "./ReceivedChat";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the root element for accessibility

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiverId } = useParams();

  const { users, user: currentUser } = useSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [clickedImage, setClickedImage] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (receiverId) {
      const foundUser = users.find((u) => u._id === receiverId);
      setSelectedUser(foundUser || null);
    }
  }, [receiverId, users]);

  const handleUserClick = (user) => {
    navigate(`/chats/${user._id}/send`);
    setShowEdit(false);
    setDropdownOpen(false);
  };

  const handleEditClick = () => {
    setShowEdit(true);
    setDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    setDropdownOpen(false);
  };

  const handleUpdate = (updatedUser) => {
    setSelectedUser(updatedUser);
    setShowEdit(false);
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  const openImageModal = (imageUrl) => {
    setClickedImage(imageUrl || "/default.png");
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 border-r overflow-y-auto flex flex-col">
        {/* User profile at top */}
        <div
          className="p-4 flex items-center gap-3 border-b cursor-pointer hover:bg-gray-200"
          onClick={() => openImageModal(currentUser?.profileImage || "/default.png")}
        >
          <img
            src={currentUser?.profileImage || "/default.png"}
            alt={currentUser?.fullname}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {currentUser?.fullname || "Unknown User"}
            </h3>
            <p className="text-xs text-gray-500">My Profile</p>
          </div>
        </div>

        <div className="p-4 border-b bg-white font-semibold text-lg">Users</div>
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={user.profileImage || "/default.png"}
                alt={user.fullname}
                className="w-10 h-10 rounded-full object-cover border"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal(user.profileImage || "/default.png");
                }}
              />
              <span className="text-sm font-medium text-gray-800">
                {user.fullname}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="w-2/3 relative flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 flex justify-between items-center bg-white border-b">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.profileImage || "/default.png"}
                  alt={selectedUser.fullname}
                  className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                  onClick={() => openImageModal(selectedUser.profileImage || "/default.png")}
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {selectedUser.fullname}
                  </h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              {selectedUser._id === currentUser._id && (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Menu"
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <button
                        onClick={handleEditClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FiEdit className="mr-2" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleSettingsClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t border-gray-100"
                      >
                        <FiSettings className="mr-2" />
                        Settings
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {showEdit ? (
              <div className="p-4 overflow-auto">
                <UserCard
                  user={selectedUser}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                />
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto p-4">
                <Routes>
                  <Route
                    path="/chats/:receiverId/send"
                    element={<SendChat to={receiverId} />}
                  />
                  <Route
                    path="/chats/:receiverId/received"
                    element={<ReceivedChat from={receiverId} />}
                  />
                </Routes>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={imageModalOpen}
        onRequestClose={closeImageModal}
        contentLabel="Profile Image"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Profile Image</h2>
            <button
              onClick={closeImageModal}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <img
            src={clickedImage}
            alt="Full profile"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
