// import Container from "../Components/Shared/Container";
import React from "react";
// import ComplainBox from "../Components/ComplainBox";
import ComplainBoxes from "../Components/ComplainBoxes";

const HomePage = () => {
  console.log("Home page entered.");

  return (
    <>
      <div className="bg-gray-200">
      <ComplainBoxes/>

      </div>
      {/* <Container>
        <div>Complains</div>
        <div>gsdfhei</div>
      </Container> */}
    </>
  );
};

export default HomePage;
