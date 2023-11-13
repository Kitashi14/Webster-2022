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
  const [fcomplain, setfcomplain] = useState(false);

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
    if (status === profession) {
      alert("Select a valid filter");
      setfcomplain(!fcomplain);
      return;
    }

    try {
      console.log("sending request to filter complain");

      const Data = {
        profession,
        status,
        distance: null,
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
        setComplainsData(responseData.data);
        return;
      } else if (response.status === 400) {
        console.log(responseData.error);
        alert(responseData.error);
        setfcomplain(!fcomplain);
        return;
      } else {
        throw Error("Couldn't filter complain");
      }
    } catch (err) {
      console.log(err);
      alert("Couldn't able to filter complains");
      setfcomplain(!fcomplain);
      return;
    }
  };

  const usernameButtonHandler = async () => {
    const username = userNameInputRef.current.value;

    if (username.length === 0) {
      alert("Enter a username");
      setfcomplain(!fcomplain);
      return;
    }

    try {
      console.log("sending request to filter complain of username", username);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/username/${username}`
      );

      console.log(response.status);

      const responseData = await response.json();

      if (response.status === 200) {
        setComplainsData(responseData.data);
        return;
      } else if (response.status === 400) {
        console.log(responseData.error);
        alert(responseData.error);
        setfcomplain(!fcomplain);
        return;
      } else {
        throw Error("Couldn't filter complain");
      }
    } catch (err) {
      console.log(err);
      alert("Couldn't able to filter complains of user", username);
      setfcomplain(!fcomplain);
      return;
    }
  };

  return (
    <>
      <div className="bg-gray-200 h-full">
        <Hero />
        <div className="flex flex-row justify-between mx-20">
          <div className="flex">
            <div className="ml-2 rounded-xl">
              <select ref={professionInputRef} className="rounded-lg px-1">
                {profession.map((data) => {
                  return (
                    <option
                      value={`${data.name}`}
                      key={`${data.name}`}
                    >{`${data.name}`}</option>
                  );
                })}
                <option value="Any">Any</option>
              </select>
            </div>
            <div className="mx-2">
              <select ref={statusInputRef} className="rounded-lg px-1">
                <option value="Not Assigned">Not Assigned</option>
                <option value="Assigned">Assigned</option>
                <option value="Resolved">Resolved</option>
                <option value="Any">Any</option>
              </select>
              <button className="mx-2 rounded-lg bg-red-500 px-2 border-red-950 border-2 hover:scale-110 text-white text-sm p-[1px]" onClick={filterButtonHandler}>Find</button>
            </div>
          </div>

          <div className="mb-4">
            <input
              className="px-3 py-2 mx-2 text-sm leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              ref={userNameInputRef}
              placeholder="Enter full username"
            />
            <button className="mx-2 rounded-lg bg-red-500 px-2 border-red-950 border-2 hover:scale-110 text-white p-[3px] px-4" onClick={usernameButtonHandler}>Search</button>
          </div>
        </div>

        <ComplainBoxes complains={complainsData} />
      </div>
    </>
  );
};

export default HomePage;
