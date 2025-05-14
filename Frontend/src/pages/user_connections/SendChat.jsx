import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, fetchMessages } from '../../redux/chatSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiSend,
  FiCheck,
  FiCheckCircle
} from 'react-icons/fi';
import moment from 'moment';

const SendChat = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { receiverId } = useParams();
  const authToken = localStorage.getItem('authToken');
  const currentUserId = authToken;

  const { messages, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    if (receiverId) {
      dispatch(fetchMessages(receiverId));
    }
  }, [receiverId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e, msgObj = null) => {
    e?.preventDefault();
    if (isSending) return;

    const finalMessage = msgObj?.message || message.trim();
    if (!finalMessage) return;

    const tempTimestamp = new Date().toISOString();
    const messageData = {
      senderId: currentUserId,
      receiverId,
      message: finalMessage,
      timestamp: msgObj?.timestamp || tempTimestamp,
      status: 'sending'
    };

    setIsSending(true);

    dispatch({ type: 'chat/addOptimisticMessage', payload: messageData });

    try {
      const result = await dispatch(sendMessage({ receiverId, messageData })).unwrap();

      dispatch({
        type: 'chat/updateMessageStatus',
        payload: {
          tempId: messageData.timestamp,
          status: 'sent',
          messageId: result.messageId
        }
      });

      if (!msgObj) setMessage('');
      // ❌ Removed success toast
    } catch (err) {
      dispatch({
        type: 'chat/updateMessageStatus',
        payload: {
          tempId: messageData.timestamp,
          status: 'failed'
        }
      });

      toast.error('Failed to send message', {
        position: 'bottom-right',
        autoClose: 2000
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = (msg) => {
    handleSend(null, msg);
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).format('h:mm A');
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin ml-1" />;
      case 'sent':
        return <FiCheck className="inline text-white ml-1" />;
      case 'delivered':
      case 'read':
        return (
          <span className="flex items-center ml-1">
            <FiCheck className="inline text-green-300" />
            <FiCheck className="inline text-green-300 -ml-1" />
          </span>
        );
      case 'failed':
        return <span className="text-red-500 ml-1">!</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
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
              key={msg.messageId || msg.timestamp}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 relative ${
                  msg.senderId === currentUserId
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs mt-1 flex items-center justify-end">
                  {formatTime(msg.timestamp)}
                  {msg.senderId === currentUserId && getMessageStatusIcon(msg.status)}
                </div>
                {msg.status === 'failed' && (
                  <button
                    onClick={() => handleResend(msg)}
                    className="absolute -bottom-4 right-1 text-xs text-red-500 hover:underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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
