import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
