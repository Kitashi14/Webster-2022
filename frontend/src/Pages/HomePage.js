// import Container from "../Components/Shared/Container";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import ComplainBox from "../Components/ComplainBox";
import ComplainBoxes from "../Components/ComplainBoxes";
import Hero from "../Components/Hero";
import { profession } from "../Helper/Profession";

const HomePage = () => {
  const [complainsData, setComplainsData] = useState([]);

  const navigate = useNavigate();

  const professionInputRef = useRef();
  const statusInputRef = useRef();
  const userNameInputRef = useRef();
  const [fcomplain,setfcomplain] = useState(false);

  useEffect(() => {
    const getComplainData = async () => {
      console.log("sending request to fetch latest complains");
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
    };
    getComplainData();
  }, [fcomplain]);

  console.log("Home page entered.");

  const filterButtonHandler = async () => {
    var profession = professionInputRef.current.value;
    var status = statusInputRef.current.value;

    if (status === "Any") status = null;
    if (profession === "Any") profession = null;
    if(status === profession) {
      alert("Select a valid filter");
      setfcomplain(!fcomplain);
      return;
    }
    
    try {
      console.log("sending request to filter complain");

      const Data = {
        profession,
        status,
        distance :null
      };

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/filter`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(Data),
          credentials: "include",
        }
      );

      console.log(response.status);

      const responseData = await response.json();

      if (response.status === 200) {
        console.log(responseData.message);
        setComplainsData(responseData.data);
        return;
      } else if (response.status === 400) {
        console.log(responseData.error);
        alert(responseData.error);
      } else {
        throw Error("Couldn't filter complain");
      }

    } catch (err) {
      console.log(err);
      alert("Couldn't able to filter complains");
    }
  };

  const usernameButtonHandler = async () => {
    const username = userNameInputRef.current.value;
    console.log("sdjfs");

    if(username.length ===0 ){
      alert("Enter a username");
      return;
    }

    try {
      console.log("sending request to filter complain of username", username);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/username/${username}`);

      console.log(response.status);

      const responseData = await response.json();

      if (response.status === 200) {
        console.log(responseData.message);
        setComplainsData(responseData.data);
        return;
      } else if (response.status === 400) {
        console.log(responseData.error);
        alert(responseData.error);
      } else {
        throw Error("Couldn't filter compalain");
      }

    } catch (err) {
      console.log(err);
      alert("Couldn't able to filter complains of user",username);
      return;
    }
  };


  return (
    <>
      <div className="bg-gray-200">
        <Hero />
        <div>
          <select ref={professionInputRef}>
            {profession.map((data) => {
              return <option value={`${data.name}`} key={`${data.name}`}>{`${data.name}`}</option>;
            })}
            <option value="Any">Any</option>
          </select>
        </div>
        <div>
          <select ref={statusInputRef}>
            <option value="Not Approved">Not Approved</option>
            <option value="Approved">Approved</option>
            <option value="Resolved">Resolved</option>
            <option value="Any">Any</option>
          </select>
          <button onClick={filterButtonHandler}>Find</button>
        </div>
        <div className="mb-4">
          <input
            className="w-1/5 px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="text"
            type="text"
            ref={userNameInputRef}
            placeholder="Enter username"
          />
          <button onClick={usernameButtonHandler}>Search</button>
        </div>

        <ComplainBoxes complains={complainsData} />

        
      </div>
    </>
  );
};

export default HomePage;
