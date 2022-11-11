// import Container from "../Components/Shared/Container";
import React, { useEffect, useRef, useState } from "react";
// import ComplainBox from "../Components/ComplainBox";
import ComplainBoxes from "../Components/ComplainBoxes";
import Hero from "../Components/Hero";

const HomePage = () => {
  const [complainsData, setComplainsData] = useState([]);

  const professionInputRef = useRef();
  const statusInputRef = useRef();
  const userNameInputRef = useRef();

  useEffect(() => {
    const getComplainData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/latest`
        );

        const responseData = await response.json();

        console.log("response status", response.status);

        if (response.status === 200) {
          console.log("got latest complains");
          setComplainsData(responseData.data);
          return;
        } else if (response.status === 400) {
          console.log(responseData.error);
          alert(responseData.error);
          return;
        } else {
          console.log(response.error);
          alert("Couldn't able to fetch latest complains");
        }
      } catch (err) {
        console.log(err);
        alert("Couldn't able to fetch latest complains");
      }

      getComplainData();
    };
  }, []);

  console.log("Home page entered.");

  return (
    <>
      <div className="bg-gray-200">
        <Hero />
        <ComplainBoxes complains={complainsData} />
      </div>
      {/* <Container>
        <div>Complains</div>
        <div>gsdfhei</div>
      </Container> */}
    </>
  );
};

export default HomePage;
