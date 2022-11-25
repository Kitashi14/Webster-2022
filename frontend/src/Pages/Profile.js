import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const userName = useParams().uid;
  const navigate = useNavigate();

  const [details, setDetails] = useState({});
  const [regComplains, setRegComplains] = useState({});
  const [aprvComplains, setAprvComplains] = useState({});
  const [isOwner, setIsOwner] = useState(false);

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
  }, [userName, navigate]);

  return <>{userName}</>;
};

export default Profile;
