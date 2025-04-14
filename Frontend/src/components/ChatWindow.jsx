// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { sendMessage } from "../redux/chatSlice";  // Import Redux action

// const ChatWindow = () => {
//   const dispatch = useDispatch();
//   const { currentMessages, isLoading, error } = useSelector((state) => state.chat);
//   const [message, setMessage] = useState("");

//   const handleSendMessage = () => {
//     const userId = currentMessages[0]?.user._id;  // Assuming currentMessages has the user's info
//     if (message) {
//       dispatch(sendMessage({ userId, message }));
//       setMessage("");  // Clear message input
//     }
//   };

//   return (
//     <div>
//       <h3>Chat</h3>
//       {isLoading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//       <div>
//         {currentMessages.map((msg) => (
//           <div key={msg._id}>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//       </div>
//       <textarea
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message"
//       />
//       <button onClick={handleSendMessage}>Send</button>
//     </div>
//   );
// };

// export default ChatWindow;
