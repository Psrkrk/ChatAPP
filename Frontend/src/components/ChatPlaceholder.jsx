const ChatPlaceholder = () => {
    return (
      <div className="w-[70%] h-screen bg-[#222e35] text-white flex flex-col items-center justify-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          className="w-20 h-20 mb-4"
          alt="WhatsApp"
        />
        <h1 className="text-2xl font-semibold mb-2">WhatsApp for Windows</h1>
        <p className="text-gray-400 text-center max-w-sm">
          This app does not currently have WhatsApp Business features (like catalogs, labels and messaging tools).
        </p>
      </div>
    );
  };
  
  export default ChatPlaceholder;
  