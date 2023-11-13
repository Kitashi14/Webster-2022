import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/ui/Modal";
import BackDrop from "../Components/ui/Backdrop";
import AcceptedWorker from "../Components/AcceptedWorker";
import WorkerList from "../Components/WorkerList";
import AcceptedWorkers from "../Components/AcceptedWorkers";
import { workers } from "../Helper/Workers";
// import { type } from "os";

const ComplainDetails = () => {
  const complainId = useParams().cid;
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [isCreator, setIsCreator] = useState(false);
  console.log(details);
  console.log("isCreator:", isCreator);

  useEffect(() => {
    const fetchComplainDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/getDetails/${complainId}`,
          {
            credentials: "include",
          }
        );

        console.log(response.status);

        const responseData = await response.json();

        if (response.status === 200) {
          setDetails(responseData.data.complain);
          setIsCreator(responseData.data.isVerifiedUser);
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

  const closeModal = (e) => {
    e.preventDefault();
    setModalIsOpen(false);
  };

  const deleteComplain = async () => {
    setModalIsOpen(false);
    console.log("to delete complain api request hit");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/${complainId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log(response.status);

      const responseData = await response.json();

      if (response.status === 200) {
        alert(responseData.message);
        navigate("/");
        return;
      } else if (response.status === 400) {
        alert(responseData.error);
        return;
      } else if (response.status === 500) {
        throw Error(responseData.error);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete complain.");
      return;
    }
  };

  // var date = details.creationTime;
  // console.log(typeof date);
  // const day = date.split("T")[0];
  // console.log(day);

  // const [workersData, setWorkersData] = useState([]);
  // const [fworker, setfworker] = useState(false);

  // useEffect(() => {
  //   const getWorkerData = async () => {
  //     console.log("sending request to fetch latest workers...");
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/latest`
  //       );

  //       const responseData = await response.json();

  //       console.log("response status", response.status);

  //       if (response.status === 200) {
  //         console.log("got latest workers");
  //         setWorkersData(responseData.data);
  //         return;
  //       } else if (response.status === 400) {
  //         console.log(responseData.error);
  //         alert(responseData.error);
  //         return;
  //       } else {
  //         console.log(response.error);
  //         alert("Couldn't able to fetch latest workers");
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       alert("Couldn't able to fetch latest workers");
  //     }
  //   };
  //   getWorkerData();
  // }, [fworker]);

  return (
    <>
      {/* <Modal show={modalIsOpen} onCancel={closeModal} onOk={deleteComplain} header={"Press OK to delete this complain"}>
            
        </Modal>
        {modalIsOpen ? <BackDrop onCancel={closeModal} /> : null}
        <div>
            {complainId}
        </div>

        {isCreator ? (
            <>
            <button onClick={OpenDeleteModal}>Delete</button>
            </>
        ): (
            <></>
        )} */}
      <div className=" bg-red-100 w-full h-full">
        <div className="flex p-4">Back</div>
        <main className="flex flex-col m-4 p-2 mt-8">
          <div className="p-2 bg-red-300 flex-col w-full h-fit content-around">
            <div className="flex bg-white md:flex-row flex-col items-center ">
              <img
                class="p-4 object-cover md:w-1/4 basis-1/3 rounded-lg md:h-1/3"
                src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                alt="profile pic"
              />

              <div className="flex basis-2/3 h-full flex-col justify-between p-4 leading-normal">
                <h1 className=" text-2xl">Title : {details.title}</h1>
                <h1 className=" text-2xl">
                  Username : {details.creatorUsername}
                </h1>
                <h1 className=" text-2xl">Status : {details.status}</h1>
                <h1 className=" text-2xl">
                  Description : {details.description}
                </h1>
                <h1 className=" text-2xl">Profession : {details.profession}</h1>
                <h1 className=" text-2xl">Address : {details.address}</h1>
                <h1 className=" text-2xl">Phone No. : {details.phonenum}</h1>
                <h1 className=" text-2xl">
                  Worker Assigned : {details.workerUsername}
                </h1>
                {/* <h1 className=" text-2xl">complaint Date : {day}</h1> */}
              </div>
            </div>
            {isCreator ? (
              <>
                <div className="flex justify-center m-3">
                  <div className="p-2 bg-red-800 hover:-translate-y-1 hover:scale-110 rounded-md  text-white">
                    accept
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-around m-3">
                  <div className="p-2 bg-blue-800 hover:-translate-y-1 hover:scale-110 rounded-md  text-white">
                    EDIT
                  </div>
                  <div className="p-2 bg-red-800 hover:-translate-y-1 hover:scale-110 rounded-md  text-white">
                    DELETE
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        {isCreator ? (
          <></>
        ) : (
          <>
            <main className="flex flex-col m-4 p-2 mt-8">
              <div className=" bg-red-300 flex-col w-full h-fit p-2 content-around text-center text-2xl">
                Assigned to
                {/* Insert AcceptedWorker profile */}
                <Link to={`/workers/${AcceptedWorkers}`}></Link>
              </div>
            </main>

            <main className="flex flex-col m-4 p-2 mt-8">
              <div className=" bg-red-300 flex-col w-full h-fit p-2 content-around">
                <p className="text-center text-2xl bg-red-100 p-1 text-red-800">
                  Workers who wants to accept this task
                </p>
                <AcceptedWorkers workers={workers} />
              </div>
            </main>
          </>
        )}
      </div>
    </>
  );
};

export default ComplainDetails;
