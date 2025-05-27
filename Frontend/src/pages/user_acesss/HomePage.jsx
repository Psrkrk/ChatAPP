import React from "react";

import Content from "../../components/Content.jsx";
import Content1 from "../../components/Content1.jsx";
// import Service from "../../components/Service.jsx"; // <-- import Service here
import MainLayout from "../../Layout/MainLayout.jsx";

const HomePage = () => {
  return (
    <MainLayout>
      <Content />
      <Content1 />
      {/* <Service />   add Service here */}
    </MainLayout>
  );
};

export default HomePage;
