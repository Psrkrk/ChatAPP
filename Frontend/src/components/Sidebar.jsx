import { FaUserCircle, FaCommentDots, FaSearch, FaEllipsisV } from 'react-icons/fa';
import { HiStatusOnline } from 'react-icons/hi';
import ChatList from './ChatList'; // ✅ Import ChatList

const Sidebar = () => {
  return (
    <div className="w-[30%] h-screen bg-[#111b21] text-white border-r border-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <FaUserCircle size={28} />
        <div className="flex gap-4">
          <HiStatusOnline />
          <FaCommentDots />
          <FaEllipsisV />
        </div>
      </div>

      <div className="p-2">
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="w-full px-4 py-2 rounded-lg bg-[#202c33] text-white placeholder-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ChatList />  {/* ✅ Make sure this is rendered */}
      </div>
    </div>
  );
};

export default Sidebar;
