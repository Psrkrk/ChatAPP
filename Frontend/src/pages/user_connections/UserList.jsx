import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getAllUsers,
  updateProfile,
  setUserProfile,
} from "../../redux/userSlice";
import SendChat from "./SendChat.jsx";
import ReceivedChat from "./ReceivedChat.jsx";
import { FiSend, FiInbox } from "react-icons/fi";
import Notification from "../../components/Notifications";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const location = useLocation();

  const { users, user: currentUser, isLoading } = useSelector((state) => state.user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentUser?.profileImage || "/default-user.png");
  const [editData, setEditData] = useState({
    fullname: currentUser?.fullname || "",
    profileImage: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (receiverId && currentUser) {
      if (receiverId === currentUser._id) {
        setSelectedUser(currentUser);
      } else {
        const found = users.find((u) => u._id === receiverId);
        setSelectedUser(found || null);
      }
    } else {
      setSelectedUser(null);
    }
  }, [receiverId, users, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setPreviewImage(currentUser.profileImage || "/default-user.png");
      setEditData({
        fullname: currentUser.fullname || "",
        profileImage: null,
      });
    }
  }, [currentUser]);

  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type });
    }, 3000);
  }, []);

  const handleUserClick = useCallback(
    (user) => {
      if (isLoading) return;
      setShowEdit(false);
      navigate(`/chats/${user._id}/send`);
      showNotification(`Now chatting with ${user.fullname}`, "success");
    },
    [isLoading, navigate, showNotification]
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      showNotification("Please select an image file", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showNotification("Image size should be less than 2MB", "error");
      return;
    }

    setEditData((d) => ({ ...d, profileImage: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setShowEdit(false);
    setEditData({
      fullname: currentUser?.fullname || "",
      profileImage: null,
    });
    setPreviewImage(currentUser?.profileImage || "/default-user.png");
    showNotification("Edit cancelled", "info");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", editData.fullname.trim());
    if (editData.profileImage) {
      formData.append("profileImage", editData.profileImage);
    }

    try {
      const resultAction = await dispatch(updateProfile(formData)).unwrap();
      if (resultAction?.user) {
        dispatch(setUserProfile(resultAction.user));
        showNotification("Profile updated successfully", "success");
        setShowEdit(false);
        dispatch(getAllUsers());
      } else {
        throw new Error("Invalid update response");
      }
    } catch (error) {
      console.error("Update failed:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  const pathSegments = location.pathname.split("/");
  const chatMode = pathSegments[pathSegments.length - 1];

  return (
    <div className="flex h-screen bg-gray-50">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((n) => ({ ...n, show: false }))}
        />
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => navigate("/chats")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium ${
              !receiverId ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiInbox className="w-4 h-4" />
            All Chats
          </button>
          <button
            onClick={() => currentUser && navigate(`/chats/${currentUser._id}/received`)}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium ${
              selectedUser?._id === currentUser?._id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiSend className="w-4 h-4" />
            My Chats
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={user.profileImage || "/default-user.png"}
                alt={user.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm font-medium text-gray-700">{user.fullname}</div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowEdit(true)}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        {showEdit ? (
          <form onSubmit={handleUpdate} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

            <div className="flex items-center gap-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={editData.fullname}
                onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm text-sm"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-600 hover:text-black">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Save
              </button>
            </div>
          </form>
        ) : selectedUser ? (
          chatMode === "received" ? (
            <ReceivedChat receiverId={selectedUser._id} />
          ) : (
            <SendChat receiverId={selectedUser._id} />
          )
        ) : (
          <div className="text-gray-500 text-center text-lg mt-10">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default UserList;
