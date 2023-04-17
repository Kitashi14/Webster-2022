import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profession } from "../Helper/Profession";

const Profile = () => {
  const userName = useParams().uid;
  const navigate = useNavigate();
  const availableProfession = profession;

  const [details, setDetails] = useState({});
  const [userProfessions, setUserProfessions] = useState([]);
  const [regComplains, setRegComplains] = useState({});
  const [aprvComplains, setAprvComplains] = useState({});
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
  console.log("aprvComplains :", aprvComplains);
  console.log("isOwner :", isOwner);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/user/${userName}`,
          {
            credentials: "include",
          }
        );

        console.log(response.status);

        const responseData = await response.json();

        if (response.status === 200) {
          setDetails(responseData.data.userDetails);
          setIsOwner(responseData.data.isVerifiedUser);
          setRegComplains(responseData.data.regComplains);
          setAprvComplains(responseData.data.aprvComplains);
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
      username: userName
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
      {userName}<br>
      </br>
      profession :
      <div className="text-red-500" key="profession">
        {userProfessions.map((data) => {
          return (
            <>
              <Link to={`/worker/${userName}/${data.workerProfession}`}>
                <span>{`${data.workerProfession}`}</span>
              </Link>
              <br></br>
            </>
          );
        })}
      </div>
      {isOwner ? (
        <>
          <div>
            Add profession:
            <div>
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
              <button onClick={addProfessionButtonHandler}>Add</button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Profile;
