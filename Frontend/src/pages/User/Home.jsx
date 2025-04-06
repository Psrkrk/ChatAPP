import Sidebar from '../../components/Sidebar';
import ChatPlaceholder from '../../components/ChatPlaceholder';

const Home = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatPlaceholder />
    </div>
  );
};

export default Home;
