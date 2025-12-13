// import Container from "../Components/Shared/Container";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import ComplainBox from "../Components/ComplainBox";
import ComplainBoxes from "../Components/ComplainBoxes";
import Hero from "../Components/Hero";
import { profession } from "../Helper/Profession";
import { SkeletonList } from "../Components/ui/Loading";

const HomePage = () => {
  const [complainsData, setComplainsData] = useState([]);
  const [filteredComplainsData, setFilteredComplainsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          setFilteredComplainsData(responseData.data);
          setIsLoading(false);
          return;
        } else if (response.status === 400) {
          console.log(responseData.error);
          alert(responseData.error);
          setIsLoading(false);
          return;
        } else {
          console.log(response.error);
          alert("Couldn't able to fetch latest complains");
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        alert("Couldn't able to fetch latest complains");
        setIsLoading(false);
      }
    };
    getComplainData();
  }, [fcomplain]);

  console.log("Home page entered.");

  // const filterButtonHandler = async () => {
  //   console.log("Filter button clicked",filteredComplainsData);
  //   var profession = professionInputRef.current.value;
  //   var status = statusInputRef.current.value;

  //   if (status.toLowerCase() === "any") status = null;
  //   if (profession.toLowerCase() === "any") profession = null;
  //   console.log("inside filter button handler", profession, status);
  //   if (status === profession) {
  //     alert("Select a valid filter");
  //     setfcomplain(!fcomplain);
  //     return;
  //   }

  //   try {
  //     console.log("sending request to filter complain");

  //     const Data = {
  //       profession,
  //       status,
  //       distance: null,
  //     };

  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/filter`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-type": "application/json",
  //         },
  //         body: JSON.stringify(Data),
  //         credentials: "include",
  //       }
  //     );

  //     console.log(response.status);

  //     const responseData = await response.json();

  //     if (response.status === 200) {
  //       setComplainsData(responseData.data);
  //       return;
  //     } else if (response.status === 400) {
  //       console.log(responseData.error);
  //       alert(responseData.error);
  //       setfcomplain(!fcomplain);
  //       return;
  //     } else {
  //       throw Error("Couldn't filter complain");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     alert("Couldn't able to filter complains");
  //     setfcomplain(!fcomplain);
  //     return;
  //   }
  // };

  const filterButtonHandler = () => {
    let profession = professionInputRef.current.value;
    let status = statusInputRef.current.value;


    if (profession.toLowerCase() === "any") profession = null;
    if (status.toLowerCase() === "any") status = null;

    const filtered = complainsData.filter(complaint => {
      const professionMatch = profession ? complaint.profession === profession : true;
      const statusMatch = status ? complaint.status.toLowerCase() === status.toLowerCase() : true;
      console.log("inside filter" , profession,complaint.profession, complaint.status,status ,professionMatch,statusMatch)
      return professionMatch && statusMatch;
    });

    setFilteredComplainsData(filtered);
  };


  // const usernameButtonHandler = async () => {
  //   const username = userNameInputRef.current.value;

  //   if (username.length === 0) {
  //     alert("Enter a username");
  //     setfcomplain(!fcomplain);
  //     return;
  //   }

  //   try {
  //     console.log("sending request to filter complain of username", username);

  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/username/${username}`
  //     );

  //     console.log(response.status);

  //     const responseData = await response.json();

  //     if (response.status === 200) {
  //       setComplainsData(responseData.data);
  //       return;
  //     } else if (response.status === 400) {
  //       console.log(responseData.error);
  //       alert(responseData.error);
  //       setfcomplain(!fcomplain);
  //       return;
  //     } else {
  //       throw Error("Couldn't filter complain");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     alert("Couldn't able to filter complains of user", username);
  //     setfcomplain(!fcomplain);
  //     return;
  //   }
  // };

const usernameButtonHandler = () => {
    const username = userNameInputRef.current.value;
    if (username.length === 0) setFilteredComplainsData(complainsData); 
    const filtered = complainsData.filter(complaint =>
      complaint.creatorUsername.toLowerCase().includes(username.toLowerCase())
    );
    setFilteredComplainsData(filtered);
};

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Hero />

        {/* Filters Section */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">
                    Profession
                  </label>
                  <select
                    ref={professionInputRef}
                    className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-[150px]"
                  >
                    {profession.map((data) => {
                      return (
                        <option
                          value={`${data.name}`}
                          key={`${data.name}`}
                        >{`${data.name}`}</option>
                      );
                    })}
                    <option value="Any">Any Profession</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    ref={statusInputRef}
                    className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-[150px]"
                  >
                    <option value="not_assigned">Not Assigned</option>
                    <option value="assigned">Assigned</option>
                    <option value="resolved">Resolved</option>
                    <option value="any">Any Status</option>
                  </select>
                </div>

                <div className="flex items-end gap-4">
                  <button
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={filterButtonHandler}
                  >
                    Apply Filters
                  </button>
                <button
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setfcomplain(!fcomplain)}
                >
                  Refresh
                </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">
                    Search by Username
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-[200px]"
                      type="text"
                      ref={userNameInputRef}
                      placeholder="Enter username..."
                    />
                    <button
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      onClick={usernameButtonHandler}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SkeletonList count={6} />
        ) : (
          <ComplainBoxes complains={filteredComplainsData} />
        )}
      </div>
    </>
  );
};

export default HomePage;
