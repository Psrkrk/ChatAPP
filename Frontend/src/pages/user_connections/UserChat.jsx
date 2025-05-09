import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, receivedMessages } from "../../redux/chatSlice"; // Import Redux actions
import { FiMoreVertical, FiPaperclip, FiMic, FiSmile, FiChevronLeft, FiSearch } from "react-icons/fi";
import { BsCheck2All, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

const UserChat = ({ onBack, receiverId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages || []); // Safeguard for undefined messages
  const loading = useSelector((state) => state.chat.loading);
  const [newMessage, setNewMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (receiverId) {
      dispatch(receivedMessages(receiverId)); // Fetch messages on mount or when receiver changes
    }
  }, [dispatch, receiverId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ messageData: { text: newMessage }, receiverId }));
    setNewMessage("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-emerald-700 text-white p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <img src={"dummyUser"} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          <div className="ml-3">
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-xs text-emerald-100">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-1 rounded-full hover:bg-emerald-800 transition-colors">
            <FiSearch size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <BsThreeDotsVertical size={18} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View contact</button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Media, links, and docs</button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Search</button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Clear chat</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] bg-opacity-30">
        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${message.sender === "me" ? "bg-emerald-100 rounded-tr-none" : "bg-white rounded-tl-none"}`}>
                  <p className="text-gray-800">{message.text}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1 ${message.sender === "me" ? "text-emerald-600" : "text-gray-500"}`}>
                    <span className="text-xs">{message.time}</span>
                    {message.sender === "me" && <BsCheck2All size={16} className={message.status === "read" ? "text-blue-500" : ""} />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-100 p-3 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
            <FiSmile size={22} />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200">
            <FiPaperclip size={22} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
          />
          <button type="submit" className="p-2 text-white bg-emerald-600 rounded-full hover:bg-emerald-700">
            {newMessage.trim() === "" ? <FiMic size={22} /> : <IoMdSend size={22} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserChat;
