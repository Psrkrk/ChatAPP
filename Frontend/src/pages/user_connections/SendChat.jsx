
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import socket from "../../utils/socket.js";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../../redux/chatSlice.js";
import { getAllUsers } from "../../redux/userSlice.js";
import { deleteMessage, deleteConversation } from "../../redux/messagecontrolSlice.js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSend, FiCheck, FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

const ContextMenu = ({ position, onClose, onDelete, isConversation = false }) => {
  const { x, y } = position;
  // Boundary checks to keep menu on-screen
  const menuWidth = 192; // w-48 = 12rem = 192px
  const menuHeight = 64; // Approximate height
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bg-white shadow-lg rounded-lg py-2 w-48 z-50 border border-gray-200"
      style={{ top: adjustedY, left: adjustedX }}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={isConversation ? "Conversation context menu" : "Message context menu"}
    >
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
        role="menuitem"
        aria-label={isConversation ? "Delete conversation" : "Delete message"}
      >
        <FiTrash2 className="w-4 h-4" />
        {isConversation ? "Delete Conversation" : "Delete Message"}
      </button>
    </motion.div>
  );
};

const MessageItem = memo(({ msg, currentUserId, selectMode, selectedMessages, toggleSelectMessage, handleContextMenu, handleTouchStart, handleTouchEnd, getStatusIcon }) => (
  <div
    className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-2`}
    onContextMenu={(e) => handleContextMenu(e, msg)}
    onTouchStart={(e) => handleTouchStart(e, msg)}
    onTouchEnd={handleTouchEnd}
    onTouchMove={handleTouchEnd} // Cancel long-press on scroll
  >
    <div
      className={`max-w-[70%] sm:max-w-xs md:max-w-sm lg:max-w-md rounded-lg px-4 py-2 shadow-sm relative flex items-center gap-2 ${
        msg.senderId === currentUserId
          ? "bg-indigo-600 text-white rounded-br-none"
          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
      }`}
    >
      {selectMode && (
        <input
          type="checkbox"
          checked={selectedMessages.includes(msg.messageId)}
          onChange={() => toggleSelectMessage(msg.messageId)}
          className="w-4 h-4"
          aria-label={`Select message from ${msg.senderId === currentUserId ? "you" : "other"}`}
        />
      )}
      <div>
        <div className="text-sm">{msg.message}</div>
        <div className="text-xs mt-1 flex items-center justify-end text-gray-400">
          {moment(msg.timestamp).format("h:mm A")}
          {msg.senderId === currentUserId && getStatusIcon(msg.status)}
        </div>
      </div>
    </div>
  </div>
));

const SendChat = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const touchTimer = useRef(null);
  const dispatch = useDispatch();
  const { receiverId } = useParams();

  const currentUser = useSelector((state) => state.user?.user || {});
  const currentUserId = currentUser._id || localStorage.getItem("userId");
  const { messages, loading: chatLoading } = useSelector((state) => state.chat || {});
  const { users = [], isLoading: usersLoading, error: usersError } = useSelector(
    (state) => state.user || {}
  );
  const receiver = users.find((user) => user._id === receiverId) || {};

  useEffect(() => {
    if (receiverId) {
      dispatch(fetchMessages(receiverId));
    }
    dispatch(getAllUsers());
  }, [receiverId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleScrollOrResize = () => setContextMenu(null);
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.senderId === receiverId || newMessage.receiverId === currentUserId) {
        dispatch({ type: "chat/receiveMessage", payload: newMessage });
      }
    });

    socket.on("onlineUsers", (onlineUsers) => {
      console.log("Online Users:", onlineUsers);
    });

    socket.on("deleteMessage", ({ messageId }) => {
      dispatch({ type: "chat/removeMessage", payload: { messageId } });
      toast.info("A message was deleted");
    });

    socket.on("deleteConversation", ({ userId, receiverId: deletedReceiverId }) => {
      if (deletedReceiverId === receiverId || userId === receiverId) {
        dispatch({ type: "chat/clearMessages" });
        toast.info("All messages deleted");
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUs");
      socket.off("deleteMessage");
      socket.off("deleteConversation");
    };
  }, [dispatch, receiverId, currentUserId]);

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

  const handleContextMenu = useCallback((e, msg) => {
    e.preventDefault();
    if (msg.senderId !== currentUserId || !msg.messageId) return;
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      messageId: msg.messageId,
      isConversation: false,
    });
  }, [currentUserId]);

  const handleSelectAllContextMenu = useCallback((e) => {
    e.preventDefault();
    if (selectedMessages.length === messages.length && messages.length > 0) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        isConversation: true,
      });
    }
  }, [selectedMessages, messages]);

  const handleDeleteMessage = useCallback((messageId) => {
    if (isDeleting) return;
    setIsDeleting(true);

    dispatch(deleteMessage({ messageId }))
      .unwrap()
      .then(() => {
        socket.emit("deleteMessage", { messageId, receiverId });
        dispatch({ type: "chat/removeMessage", payload: { messageId } });
        toast.success("Message deleted");
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to delete message");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }, [dispatch, receiverId, isDeleting]);

  const handleDeleteConversation = useCallback(() => {
    if (isDeleting) return;
    setIsDeleting(true);

    dispatch(deleteConversation({ userId: currentUserId, receiverId }))
      .unwrap()
      .then(() => {
        socket.emit("deleteConversation", { userId: currentUserId, receiverId });
        dispatch({ type: "chat/clearMessages" });
        setSelectedMessages([]);
        setSelectMode(false);
        toast.success("Conversation deleted");
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to delete conversation");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }, [dispatch, currentUserId, receiverId, isDeleting]);

  const toggleSelectMessage = useCallback((messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedMessages(
      selectedMessages.length === messages.length
        ? []
        : messages.map((msg) => msg.messageId).filter(Boolean)
    );
  }, [selectedMessages, messages]);

  const handleCloseContextMenu = useCallback(() => setContextMenu(null), []);

  const handleTouchStart = useCallback((e, msg) => {
    if (msg.senderId !== currentUserId || !msg.messageId) return;
    touchTimer.current = setTimeout(() => {
      setContextMenu({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        messageId: msg.messageId,
        isConversation: false,
      });
    }, 500);
  }, [currentUserId]);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(touchTimer.current);
  }, []);

  const getStatusIcon = useCallback((status) => {
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
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50" onClick={handleCloseContextMenu}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
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
        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectMode(!selectMode)}
              className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
              disabled={isDeleting}
              aria-label={selectMode ? "Exit select mode" : "Enter select mode"}
            >
              {selectMode ? "Cancel" : "Select"}
            </button>
            {selectMode && (
              <button
                onClick={toggleSelectAll}
                className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
                disabled={isDeleting}
                aria-label={selectedMessages.length === messages.length ? "Deselect all" : "Select all"}
              >
                {selectedMessages.length === messages.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onContextMenu={selectMode ? handleSelectAllContextMenu : undefined}
      >
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
            <MessageItem
              key={`${msg.senderId}-${msg.messageId || msg.timestamp}`}
              msg={msg}
              currentUserId={currentUserId}
              selectMode={selectMode}
              selectedMessages={selectedMessages}
              toggleSelectMessage={toggleSelectMessage}
              handleContextMenu={handleContextMenu}
              handleTouchStart={handleTouchStart}
              handleTouchEnd={handleTouchEnd}
              getStatusIcon={getStatusIcon}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onClose={handleCloseContextMenu}
            onDelete={() =>
              contextMenu.isConversation
                ? handleDeleteConversation()
                : handleDeleteMessage(contextMenu.messageId)
            }
            isConversation={contextMenu.isConversation}
          />
        )}
      </AnimatePresence>

      {/* Input */}
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
            className={`flex items-center justify-center p-2 sm:p-3 rounded-full text-white transition ${
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
