/** @format */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profession } from "../Helper/Profession";
import ComplainBoxes from "../Components/ComplainBoxes";

const Profile = () => {
  const userName = useParams().uid;
  const navigate = useNavigate();
  const availableProfession = profession;

  const [details, setDetails] = useState({});
  const [userProfessions, setUserProfessions] = useState([]);
  const [regComplains, setRegComplains] = useState([]);
  const [resComplains, setResComplains] = useState([]);
  const [assComplains, setAssComplains] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const [render, setRender] = useState(false);

  const professionInputRef = useRef();

  let toAddProfession = [];
  for (var i = 0; i < availableProfession.length; i++) {
    var flag = true;
    for (var j = 0; j < userProfessions.length; j++) {
      if (availableProfession[i].name === userProfessions[j].workerProfession) {
        flag = false;
        break;
      }
    }
    if (flag) toAddProfession.push(availableProfession[i].name);
  }

  console.log("details :", details);
  console.log("regComplains :", regComplains);
  console.log("aprvComplains :", resComplains);
  console.log("isOwner :", isOwner);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/user/getDetails/${userName}`,
          {
            credentials: "include",
          }
        );

        console.log(response.status);

        const responseData = await response.json();
        console.log("Hello");
        console.log(responseData);
        console.log("Hello");

        if (response.status === 200) {
          setRegComplains(responseData.data.regComplains);
          setDetails(responseData.data.userDetails);
          setIsOwner(responseData.data.isVerifiedUser);
          setRegComplains(responseData.data.regComplains);
          setResComplains(responseData.data.resComplains);
          setAssComplains(responseData.data.assComplains);
          setUserProfessions(responseData.data.userDetails.professions);
          return;
        } else if (response.status === 400) {
          alert(responseData.error);
          navigate("/");
          return;
        } else if (response.status === 500) {
          throw Error(responseData.error);
        }
      } catch (err) {
        console.log(err);
        alert("Failed to fetch profile details");
        navigate("/");
      }
    };

    fetchProfileDetails();
  }, [userName, navigate, render]);

  const addProfessionButtonHandler = async () => {
    console.log("add profession api hit");
    const profession = professionInputRef.current.value;
    const creationTime = new Date(Date.now());

    const data = {
      profession,
      creationTime,
      username: userName,
    };

    console.log(data);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/add`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const responseData = await response.json();
      console.log("response status:", response.status);

      if (response.status === 200) {
        console.log(responseData.data);
        alert("Profession added");
        setRender(!render);
        return;
      } else if (response.status === 400) {
        console.log(responseData.error);
        alert(responseData.error);
      } else if (response.status === 500) {
        throw Error(responseData.error);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to add profession");
      return;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen bg-gray-100">
        {/* Profile section */}
        <div className="flex flex-col m-2 items-center w-4/5 h-1/2 bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-full hover:bg-gray-100">
          <img
            className="object-cover w-1/4 basis-1/3 rounded-lg h-1/2"
            src= "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
            alt="profile pic"
          />
          <div className="flex basis-2/3 h-full flex-row justify-between p-4 leading-normal">
            <div className="flex flex-col ">
              <h5 className="flex flex-none text-2xl font-bold itemstracking-tight text-gray-900 dark:text-white">
                {userName}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                name
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                email
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                address
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                phone
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                age
              </p>
            </div>
            <div className="flex flex-col h-6">
              <button className="flex rounded">Edit</button>
            </div>
          </div>
        </div>

        {/* User Professional */}
        <div className="flex flex-col items-center w-4/5 m-auto bg-white border border-gray-200 rounded-lg shadow md:max-w-full hover:bg-gray-100">
          <h2 className="flex text-l mb-2 font-bold itemstracking-tight text-gray-900 ">
            Profession
          </h2>
          <div className="flex flex-row mb-4">
            {isOwner ? (
              <>
                <div className="flex">
                  Add profession:
                  <div className="flex ml-2 items-end">
                    <select ref={professionInputRef} key="profession">
                      {toAddProfession.map((profession) => {
                        return (
                          <option
                            value={`${profession}`}
                            key={`${profession}`}
                          >{`${profession}`}</option>
                        );
                      })}
                    </select>
                    <button
                      className="flex ml-3"
                      onClick={addProfessionButtonHandler}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div
            className="flex flex-row justify-between leading-normal"
            key="profession"
          >
            {userProfessions.map((data) => {
              return (
                <>
                  <div className="flex flex-col items-center pb-2 justify-around">
                    <img
                      className="w-8 h-8 mb-3 rounded-full shadow-lg"
                      src=""
                      alt="pic"
                    />
                    <Link to={`/worker/${userName}/${data.workerProfession}`}>
                      <span className="mb-1 text-sm font-medium text-gray-900 ">{`${data.workerProfession}`}</span>
                    </Link>
                    <span className="text-sm text-gray-500 ">Rating</span>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col  items-center justify-center w-4/5 md:max-w-full ">
          <div className="flex flex-col m-2 items-center justify-center w-full rounded-lg  bg-red-200 md:max-w-full">
            <h2 className="flex text-l mt-2 font-bold itemstracking-tight text-gray-900 ">
              Registered complains
            </h2>
            <ComplainBoxes complains={regComplains} />
          </div>

          <div className="flex flex-col m-2 items-center justify-center w-full rounded-lg bg-red-200 md:max-w-full">
            <h2 className="flex text-l mt-2 font-bold itemstracking-tight text-gray-900 ">
              Resolved complains
            </h2>
            <ComplainBoxes complains={resComplains} />
          </div>
          {isOwner ? (
            <>
              <div className="flex flex-col m-2 items-center justify-center w-full rounded-lg bg-red-200 md:max-w-full">
                <h2 className="flex text-l mt-2 font-bold itemstracking-tight text-gray-900 ">
                  Assigned complains
                </h2>
                <ComplainBoxes complains={assComplains} />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
