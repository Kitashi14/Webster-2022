import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Modal from "../Components/ui/Modal";
import BackDrop from "../Components/ui/Backdrop";
import { LoadingSpinner } from "../Components/ui/Loading";

const WorkerProfile = () => {
  const username = useParams().uid;
  const profession = useParams().profession;
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [details, setDetails] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log(details);
  console.log("isOwner:", isOwner);

  useEffect(() => {
    const fetchWokerDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/getDetails/${username}/${profession}`,
          {
            credentials: "include",
          }
        );

        console.log(response.status);

        const responseData = await response.json();
        console.log(responseData);
        if (response.status === 200) {
          setDetails(responseData.data.details || {});
          setIsOwner(responseData.data.isVerifiedUser);
          return;
        } else if (response.status === 400) {
          alert(responseData.error);
          navigate(`/user/${username}`);
          return;
        } else if (response.status === 500) {
          throw Error(responseData.error);
        }
      } catch (err) {
        console.log(err);
        alert("Failed to fetch worker details.");
        navigate(`/user/${username}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWokerDetails();
  }, [username, navigate, profession]);

  const OpenDeleteModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = (e) => {
    e.preventDefault();
    setModalIsOpen(false);
  };

  const deleteWorker = async () => {
    setModalIsOpen(false);
    console.log("to delete worker api request hit");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/delete/${username}/${profession}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const responseData = response.json();

      if (response.status === 200) {
        alert("Profession deleted successfully");
        console.log(responseData.data);
        navigate(`/user/${username}`);
      } else if (response.status === 400 || response.status === 500) {
        alert(responseData.error);
        closeModal();
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete profession.");
      closeModal();
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-slate-500 mb-4">
              <Link
                to={`/user/${username}`}
                className="hover:text-primary-600 transition-colors duration-200"
              >
                {username}
              </Link>
              <svg
                className="w-4 h-4 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-slate-700 font-medium">{profession}</span>
            </nav>
          </div>

          {/* Professional Service Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profession}
                  </h1>
                  <p className="text-primary-100">
                    Professional service by {username}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
                <div className="ml-4 text-right text-white">
                  <div className="text-sm">{details.workerFirstName || username}</div>
                  <div className="text-lg font-semibold mt-1">
                    {details.rating || details.score || 0} ⭐
                  </div>
                  <div className="text-xs mt-1">
                    <span className="mr-2">Resolved: {details.TCR ?? 0}</span>
                    <span>Score: {details.score ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-slate-500">
                        Provider
                      </span>
                      <p className="text-slate-700">{username}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500">
                        Service Type
                      </span>
                      <p className="text-slate-700">{profession}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500">
                        Started
                      </span>
                      <p className="text-slate-700">
                        {details.creationTime
                          ? new Date(details.creationTime).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    {!isOwner && (
                      <Link
                        to={`/chat/${username}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 min-w-[220px] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
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
                        Contact Provider
                      </Link>
                    )}

                    {isOwner && (
                      <button
                        onClick={OpenDeleteModal}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transform hover:scale-[1.02] transition-all duration-200"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove Service
                      </button>
                    )}

                    <Link
                      to={`/user/${username}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 min-w-[220px] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={modalIsOpen}
        onCancel={closeModal}
        onOk={deleteWorker}
        header="Remove Professional Service"
      >
        <p className="text-slate-600 mb-4">
          Are you sure you want to remove this professional service? This action
          cannot be undone.
        </p>
      </Modal>
      {modalIsOpen && <BackDrop onCancel={closeModal} />}
    </>
  );
};

export default WorkerProfile;
