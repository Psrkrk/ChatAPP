import React, { useEffect, useState, useRef } from "react";
import socket from "../../utils/socket.js";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../../redux/chatSlice.js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSend, FiCheck } from "react-icons/fi";
import moment from "moment";

const SendChat = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { receiverId } = useParams();

  // Assuming your current user ID is stored somewhere
  const currentUserId = localStorage.getItem("userId");

  const { messages, loading } = useSelector((state) => state.chat);

  // Fetch messages when receiverId changes
  useEffect(() => {
    if (receiverId) {
      dispatch(fetchMessages(receiverId));
    }
  }, [receiverId, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages from socket
  useEffect(() => {
    // Incoming message event from backend
    socket.on("receiveMessage", (newMessage) => {
      dispatch({ type: "chat/receiveMessage", payload: newMessage });
    });

    // Listen for online users update if needed
    socket.on("onlineUsers", (onlineUsers) => {
      // You can dispatch or update UI with online users
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

    // Build message object
    const msgObj = {
      senderId: currentUserId,
      receiverId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    // Optimistic UI update
    dispatch({ type: "chat/addOptimisticMessage", payload: msgObj });

    try {
      // Send message via backend API (Redux thunk)
      const result = await dispatch(sendMessage({ receiverId, messageData: msgObj })).unwrap();

      // Emit via socket so receiver gets real-time update
      socket.emit("sendMessage", result);

      // Update message status to sent
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

  // Message status icon helper (same as your original)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={`${msg.senderId}-${msg.messageId || msg.timestamp}`}
              className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 relative ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs mt-1 flex items-center justify-end">
                  {moment(msg.timestamp).format("h:mm A")}
                  {msg.senderId === currentUserId && (
                    // your status icon function here
                    <FiCheck className="inline text-white ml-1" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition"
            title="Send"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendChat;
