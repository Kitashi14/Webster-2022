import { useContext,useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/ui/Modal";
import BackDrop from "../Components/ui/Backdrop";
import AcceptedWorkers from "../Components/AcceptedWorkers";
import AuthContext from "../context/auth-context";

const ComplainDetails = () => {
  const complainId = useParams().cid;
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext).userName;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveRating, setResolveRating] = useState(5);
  const [resolveComment, setResolveComment] = useState("");
  const [details, setDetails] = useState({});
  const [acceptedWorkersList, setAcceptedWorkersList] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchComplainDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/getDetails/${complainId}`,
          {
            credentials: "include",
          }
        );
        const responseData = await response.json();
        console.log("complaindettails", responseData.data.complain);
        if (response.status === 200) {
          setDetails(responseData.data.complain);
          setAcceptedWorkersList(responseData.data.acceptedWorkersDetails || []);
          setIsCreator(currentUser === responseData.data.complain.creatorUsername);
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
        alert("Failed to fetch complain details.");
        navigate("/");
      }
    };

    fetchComplainDetails();
  }, [complainId, navigate]);

  const OpenDeleteModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };
  const handleOnAssigned = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/getDetails/${complainId}`, { credentials: 'include' });
      const data = await resp.json();
      if (resp.status === 200) {
        setDetails(data.data.complain);
        setAcceptedWorkersList(data.data.acceptedWorkersDetails || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const acceptTask = async () => {
    try {
      const already = (acceptedWorkersList || []).some(
        (w) => (w.workerUsername || w.username || w.userName) === currentUser
      );
      if (details.workerUsername) {
        alert("This task has already been assigned to a worker.");
        return;
      }
      if (already) {
        alert("You have already shown interest in this task.");
        return;
      }

      // find worker document for current user (matching username)
      const wResp = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/getDetails/${currentUser}/` + details.profession,
        { method: "GET",
          credentials: "include" }
      );
      if (wResp.status !== 200) {
        alert("You need to register as a worker for this profession to accept tasks.");
        return;
      }
      const wData = await wResp.json();
      const workerId = wData.data.details._id;

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/acceptById/${workerId}/${complainId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (response.status === 200) {
        alert("You have shown interest in this task");
        const resp = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/getDetails/${complainId}`,
          { credentials: "include" }
        );
        const data = await resp.json();
        if (resp.status === 200) {
          setDetails(data.data.complain);
          setAcceptedWorkersList(data.data.acceptedWorkersDetails || []);
        }
      } else {
        alert(responseData.error || "Failed to accept task");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to accept task");
    }
  };

  const closeModal = (e) => {
    e.preventDefault();
    setModalIsOpen(false);
  };

  const deleteComplain = async () => {
    setModalIsOpen(false);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/${complainId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (response.status === 200) {
        alert(responseData.message);
        navigate("/");
        return;
      } else if (response.status === 400) {
        alert(responseData.error);
        return;
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete complain.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Assigned":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <>
      <Modal 
        show={modalIsOpen} 
        onCancel={closeModal} 
        onOk={deleteComplain} 
        header={"Press OK to delete this complain"}
      />
      {modalIsOpen && <BackDrop/>}

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Complaint Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-100"
                    src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                    alt="Profile"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">{details.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(details.status)}`}>
                      {details.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-slate-600">
                      <span className="mr-3">👤</span>
                      <span className="font-medium">Username:</span>
                      <Link to={`/user/${details.creatorUsername}`} className="ml-2 text-blue-600 hover:text-blue-700 font-medium">
                        {details.creatorUsername}
                      </Link>
                    </div>

                    <div className="flex items-center text-slate-600">
                      <span className="mr-3">💼</span>
                      <span className="font-medium">Profession:</span>
                      <span className="ml-2">{details.profession}</span>
                    </div>

                    <div className="flex items-center text-slate-600">
                      <span className="mr-3">📞</span>
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{details.phonenum}</span>
                    </div>

                    <div className="flex items-center text-slate-600">
                      <span className="mr-3">👷</span>
                      <span className="font-medium">Assigned to:</span>
                      <span className="ml-2">{details.workerUsername || "Not assigned"}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start text-slate-600">
                      <span className="mr-3 mt-0.5">📍</span>
                      <div>
                        <span className="font-medium">Address:</span>
                        <p className="ml-0 text-slate-700">{details.address}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-slate-600">Description:</span>
                      <p className="mt-1 text-slate-700 leading-relaxed">{details.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                {!isCreator ? (
                  <div className="flex justify-center">
                    <button onClick={acceptTask} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                      Accept Task
                    </button>
                  </div>
                ) : (
                  details.workerUsername ? (
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                    <button 
                      onClick={() => {}}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="text-white font-semibold">Resolve</span>
                      <span className="text-white">✓</span>
                    </button>
                  </div>
                  ) : (
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                    <button onClick={() => navigate(`/complain/edit/${complainId}`)}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors duration-200">
                        ✏️ Edit
                    </button>
                    <button 
                      onClick={OpenDeleteModal}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Worker Section */}
          {details.workerUsername && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Assigned Worker</h2>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-800 font-medium flex items-center gap-2">
                    {details.workerUsername}
                  </span>
                  <Link 
                    to={`/user/${details.workerUsername}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Interested Workers Section */}
          {(isCreator && !details.workerUsername) && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Workers Interested in This Task</h2>
                <AcceptedWorkers
                  workers={acceptedWorkersList}
                  complainId={complainId}
                  complainDetails={details}
                  onAssigned={handleOnAssigned}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComplainDetails;