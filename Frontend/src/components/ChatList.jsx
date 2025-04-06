const ChatList = () => {
    return (
      <div className="p-2">
        <div className="flex items-center gap-4 p-3 hover:bg-[#2a3942] cursor-pointer">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-white font-medium">Lakhnai family</h3>
              <span className="text-xs text-green-500">13:32</span>
            </div>
            <p className="text-gray-400 text-sm">Priti: 🖼️ Image</p>
          </div>
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">2</span>
        </div>
      </div>
    );
  };
  
  export default ChatList;
  