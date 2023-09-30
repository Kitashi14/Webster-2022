/** @format */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profession } from "../Helper/Profession";
import ComplainBoxes from "../Components/ComplainBoxes";
import { storage } from "../Helper/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(false);

  const [render, setRender] = useState(false);

  const professionInputRef = useRef();
  const fileInputRef = useRef();

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
      setIsLoading(true);
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
        } else if (response.status === 400) {
          alert(responseData.error);
          navigate("/");
        } else if (response.status === 500) {
          throw Error(responseData.error);
        }
      } catch (err) {
        console.log(err);
        alert("Failed to fetch profile details");
        navigate("/");
      }
      setIsLoading(false);
    };

    fetchProfileDetails();
  }, [userName, navigate, render]);
  console.log(isLoading);

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

  const uploadFiles = async (file) => {
    try {
      if (!file) throw Error("file not found");
      const storageRef = ref(storage, `/complain_box/${userName}_profile_pic`);
      console.log(file, storageRef);

      const uploadTask = await uploadBytesResumable(storageRef, file);

      console.log(uploadTask);

      // uploadTask.on("state_changed", (snapshot) => {
      //   console.log(snapshot);
      //   const prog = Math.round(
      //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //   );
      //   setProgress(prog);
      // });

      const url = await getDownloadURL(uploadTask.ref);
      console.log("image uploaded");
      console.log(url);
      return url;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const deleterPrevProfile = async () => {
    const deleteImgRef = ref(storage, `/complain_box/${userName}_profile_pic`);
    // Delete the file
    deleteObject(deleteImgRef)
      .then(() => {
        // File deleted successfully
        console.log("profile deleted");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  const displayFile = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    console.log(file);
    setProfilePic(file);
  };

  const setProfilePic = async (file) => {
    if (file.size > (1048576/2)) {
      toast.error("File size should be less then 500 KB");
      return;
    }
    if (details.profilePic) {
      deleterPrevProfile();
    }
    const fileUrl = await toast.promise(uploadFiles(file), {
      pending: "Uploading...",
      success: "Uploaded 👌",
      error: "Failed to upload image. Try again",
    });
    console.log(fileUrl);
    if (!fileUrl) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/user/profilepic`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            profilepic: fileUrl
          }),
        }
      );

      const responseData = await response.json();
      if (response.status === 200) {
        toast.success("Updated profile pic");
        setRender(!render);
      } else {
        console.log(responseData.message);
        fileInputRef.current.value = null;
        toast.error("Someting went wrong. Try again.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to connect to the server");
    }
  };

  return (
    <>
      {isLoading ? (
        <>Loading....</>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-screen bg-gray-100">
            {/* Profile section */}
            <div className="flex flex-col m-2 items-center w-4/5  bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-full ">
              <div className="bg-gray-200 w-[220px] h-[220px]  border-2 border-red-600 m-5 ml-12 mr-12 rounded-full flex flex-col relative">
                <img
                  className="object-cover w-full h-full basis-1/3 text-center  rounded-full top-0 left-0 absolute"
                  src={
                    details.profilePic
                      ? details.profilePic
                      : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                  }
                  alt="profile pic"
                />
                {isOwner ? (
                  <>
                    <div className="w-full h-full rounded-full top-0 left-0 absolute opacity-0 hover:opacity-100 hover:ease-in hover:duration-100">
                      <div className="bg-opacity-30 bg-red-500 rounded-full backdrop-blur-[2px] h-full w-full font-bold text-2xl text-white flex justify-center items-center ">
                        <label htmlFor="profilePic">
                          <svg
                            className="fill-white opacity-80 hover:cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            height="2em"
                            viewBox="0 0 512 512"
                          >
                            <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                          </svg>
                        </label>
                        <input
                          id="profilePic"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={displayFile}
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex basis-2/3 ml-12 h-full flex-row justify-between p-4 leading-normal">
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
                  {!isOwner ? (
                    <>
                      <span className="mt-4">
                        <Link
                          to={`/chat/${userName}`}
                          className="bg-red-600 py-2 text-white px-3 rounded-full hover:bg-red-700"
                        >
                          Click to chat
                        </Link>
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {isOwner ? (
                  <>
                    <div className="flex flex-col h-6">
                      <button className="flex rounded">Edit</button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* User Professional */}
            <div className="flex flex-col items-center w-4/5 m-auto bg-white border border-gray-200 rounded-lg shadow md:max-w-full ">
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
                        <Link
                          to={`/worker/${userName}/${data.workerProfession}`}
                        >
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
      )}
    </>
  );
};

export default Profile;
