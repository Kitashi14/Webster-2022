import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ComplainDetails = () => {

    const complainId = useParams().cid;
    const navigate = useNavigate();

    const [details, setDetails]  = useState({});
    const [isCreator, setIsCreator] = useState(false);
    console.log(details);
    console.log("isCreator:",isCreator);

    useEffect(()=>{
        const fetchComplainDetails = async ()=>{

            try{

                const response  = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/${complainId}`,{
                    credentials: "include"
                });
                
                console.log(response.status);

                const responseData = await response.json();

                if(response.status ===200){
                    setDetails(responseData.data.complain);
                    setIsCreator(responseData.data.isVerifiedUser);
                    return;
                }
                else if(response.status===400){
                    alert(responseData.error);
                    return;
                }
                else if(response.status ===500){
                    throw Error(responseData.error);
                }
            }catch(err){
                console.log(err);
                alert("Failed to fetch complain details.");
                navigate("/");

            }
        }

        fetchComplainDetails();

        
    },[complainId,navigate]);
    return (
        <>
        <div>
            {complainId}
        </div>
        </>
    );
};

export default ComplainDetails;