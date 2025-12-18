/** @format */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profession } from "../Helper/Profession";
import ComplainBoxes from "../Components/ComplainBoxes";
import { LoadingScreen } from "../Components/ui/Loading";
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
  const [workerDetailsMap, setWorkerDetailsMap] = useState({});
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
          const userDetails = responseData.data.userDetails || {};
          const professions = userDetails.professions || [];

          setRegComplains(responseData.data.regComplains || []);
          setDetails(userDetails);
          setIsOwner(responseData.data.isVerifiedUser);
          setRegComplains(responseData.data.regComplains || []);
          setResComplains(responseData.data.resComplains || []);
          setAssComplains(responseData.data.assComplains || []);
          setUserProfessions(professions);

          (async () => {
            try {
              const map = {};
              const fetchFor = async (entry) => {
                if (!entry) return null;
                try {
                  const res = await fetch(
                    `${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/getDetails/${userName}/${encodeURIComponent(entry.workerProfession)}`,
                    { credentials: "include" }
                  );
                  if (res.status === 200) {
                    const d = await res.json();
                    // controller returns data.details
                    const details = d.data?.details || d.data || {};
                    return { key: `${userName}|${entry.workerProfession}`, data: details };
                  }
                } catch (err) {
                  console.log("worker details fetch failed", entry, err);
                }
                return null;
              };

              const promises = professions.map((p) => fetchFor(p));
              const results = await Promise.all(promises);
              for (const r of results) if (r) map[r.key] = r.data;
              setWorkerDetailsMap(map);
            } catch (err) {
              console.log("failed to fetch worker details map", err);
            }
          })();
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
    if (file.size > 1048576 / 2) {
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
            profilepic: fileUrl,
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
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        details.profilePic
                          ? details.profilePic
                          : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                      }
                      alt="profile pic"
                    />
                  </div>
                  {isOwner && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <label htmlFor="profilePic" className="cursor-pointer">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
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
                  )}
                </div>

                {/* Profile Information */}
                <div className="md:ml-8 mt-6 md:mt-0 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-slate-800">
                      {userName}
                    </h1>
                    {isOwner && (
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-slate-500">
                          Email
                        </span>
                        <p className="text-slate-700">
                          {details.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">
                          Phone
                        </span>
                        <p className="text-slate-700">
                          {details.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-slate-500">
                          Address
                        </span>
                        <p className="text-slate-700">
                          {details.address || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">
                          Age
                        </span>
                        <p className="text-slate-700">
                          {details.age || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isOwner && (
                    <Link
                      to={`/chat/${userName}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Start Chat
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* User Professions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Professional Services
                </h2>
                {isOwner && toAddProfession.length > 0 && (
                  <div className="flex items-center gap-3">
                    <select
                      ref={professionInputRef}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {toAddProfession.map((profession) => (
                        <option value={profession} key={profession}>
                          {profession}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addProfessionButtonHandler}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add
                    </button>
                  </div>
                )}
              </div>

              {userProfessions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfessions.map((data, index) => (
                    <Link
                      key={index}
                      to={`/worker/${userName}/${data.workerProfession}`}
                      className="group"
                    >
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all duration-200 group-hover:border-primary-300">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-primary-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors duration-200">
                              {data.workerProfession}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                              <span>Professional Service</span>
                              {(() => {
                                const key = `${userName}|${data.workerProfession}`;
                                const wd = workerDetailsMap[key];
                                const ratingFromMap = wd && (wd.rating || wd.avgRating || wd.score || wd.TCR);
                                const rating = ratingFromMap ?? data.rating ?? data.workerRating ?? data.score ?? data.TCR;
                                if (rating || rating === 0) {
                                  return <span className="text-slate-700 font-medium">{Number(rating).toFixed(1)} ⭐</span>;
                                }
                                return <span className="text-slate-500">No rating yet</span>;
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 text-slate-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                  <p className="text-slate-500">
                    No professional services listed
                  </p>
                </div>
              )}
            </div>

            {/* Complaints Sections */}
            <div className="space-y-8">
              {/* Registered Complaints */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  Registered Complaints
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {regComplains.length}
                  </span>
                </h2>
                <ComplainBoxes complains={regComplains} />
              </div>

              {/* Resolved Complaints */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Resolved Complaints
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {resComplains.length}
                  </span>
                </h2>
                <ComplainBoxes complains={resComplains} />
              </div>

              {/* Assigned Complaints (Owner Only) */}
              {isOwner && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>
                    Assigned Complaints
                    <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {assComplains.length}
                    </span>
                  </h2>
                  <ComplainBoxes complains={assComplains} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
