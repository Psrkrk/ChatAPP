import React, { useEffect, useState, useRef } from "react";
import socket from "../../utils/socket.js";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../../redux/chatSlice.js";
import { getAllUsers } from "../../redux/userSlice.js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSend, FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import moment from "moment";

const SendChat = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { receiverId } = useParams();

  // Current user ID from Redux or localStorage
  const currentUser = useSelector((state) => state.user?.user || {});
  const currentUserId = currentUser._id || localStorage.getItem("userId");

  // Chat and user state
  const { messages, loading: chatLoading } = useSelector((state) => state.chat || {});
  const { users = [], isLoading: usersLoading, error: usersError } = useSelector(
    (state) => state.user || {}
  );

  // Find receiver
  const receiver = users.find((user) => user._id === receiverId) || {};

  // Fetch messages and users
  useEffect(() => {
    if (receiverId) {
      dispatch(fetchMessages(receiverId));
    }
    dispatch(getAllUsers());
  }, [receiverId, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      dispatch({ type: "chat/receiveMessage", payload: newMessage });
    });

    socket.on("onlineUsers", (onlineUsers) => {
      console.log("Online Users:", onlineUsers);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
    };
  }, [dispatch]);

  // Handle sending message
  const handleSend = async (e) => {
    e.preventDefault();
    if (isSending || !message.trim()) return;

    setIsSending(true);

    const msgObj = {
      senderId: currentUserId,
      receiverId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    dispatch({ type: "chat/addOptimisticMessage", payload: msgObj });

    try {
      const result = await dispatch(
        sendMessage({ receiverId, messageData: msgObj })
      ).unwrap();

      socket.emit("sendMessage", result);

      dispatch({
        type: "chat/updateMessageStatus",
        payload: { tempId: msgObj.timestamp, status: "sent", messageId: result.messageId },
      });

      setMessage("");
    } catch (err) {
      dispatch({
        type: "chat/updateMessageStatus",
        payload: { tempId: msgObj.timestamp, status: "failed" },
      });
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Message status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <FiCheck className="inline text-gray-400 ml-1" />;
      case "sent":
        return <FiCheckCircle className="inline text-green-400 ml-1" />;
      case "failed":
        return <FiXCircle className="inline text-red-400 ml-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Receiver Image */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 shadow-sm">
        <div className="relative">
          <img
            src={receiver.profileImage || "/default-user.png"}
            alt={receiver.fullname || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
          />
          {receiver.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {receiver.fullname || "Unknown User"}
          </h2>
          <p className="text-sm text-gray-500">
            {receiver.online
              ? "Online"
              : receiver.lastSeen
              ? `Last seen ${moment(receiver.lastSeen).fromNow()}`
              : "Offline"}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {usersError && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            <p className="text-sm text-red-700">{usersError}</p>
          </div>
        )}
        {chatLoading || usersLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-lg">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={`${msg.senderId}-${msg.messageId || msg.timestamp}`}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`max-w-[70%] sm:max-w-xs md:max-w-sm lg:max-w-md rounded-lg px-4 py-2 shadow-sm relative ${
                  msg.senderId === currentUserId
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs mt-1 flex items-center justify-end text-gray-400">
                  {moment(msg.timestamp).format("h:mm A")}
                  {msg.senderId === currentUserId && getStatusIcon(msg.status)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 max-w-3xl mx-auto"
        >
          <input
            type="text"
            className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            aria-label="Message input"
          />
          <button
            type="submit"
            className={`p-2 sm:p-3 rounded-full text-white transition ${
              isSending || !message.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={isSending || !message.trim()}
            title="Send message"
            aria-label="Send message"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendChat;