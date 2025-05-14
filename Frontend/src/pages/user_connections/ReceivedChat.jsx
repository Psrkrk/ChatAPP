// pages/User/ReceivedChat.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../redux/chatSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ReceivedChat = () => {
  const dispatch = useDispatch();
  const { receiverId } = useParams();
  const [error, setError] = useState('');

  const authToken = localStorage.getItem('authToken');
  const currentUserId = authToken;

  const { messages, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!currentUserId) {
      setError('❌ authToken is missing');
      toast.error('❌ Please log in again!');
      return;
    }

    if (!receiverId) {
      setError('❌ receiverId is missing from the route');
      toast.error('❌ Receiver ID is missing!');
      return;
    }

    dispatch(fetchMessages(receiverId));
  }, [currentUserId, receiverId, dispatch]);

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 p-4">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center">No messages to show.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.messageId || msg._id || msg.timestamp}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[75%] ${
                msg.senderId === currentUserId
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <span className="block text-xs mt-1 text-right opacity-80">
                {moment(msg.timestamp || msg.createdAt).format('h:mm A')}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReceivedChat;
