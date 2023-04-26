import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/ui/Modal";
import BackDrop from "../Components/ui/Backdrop";

const ComplainDetails = () => {

    const complainId = useParams().cid;
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [details, setDetails]  = useState({});
    const [isCreator, setIsCreator] = useState(false);
    console.log(details);
    console.log("isCreator:",isCreator);

    useEffect(()=>{
        const fetchComplainDetails = async ()=>{

            try{

                const response  = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/getDetails/${complainId}`,{
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
                    navigate("/");
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

    const OpenDeleteModal = (e)=>{
        e.preventDefault();
        setModalIsOpen(true);
    }

    const closeModal = (e)=>{
        e.preventDefault();
        setModalIsOpen(false);
    }

    const deleteComplain = async()=>{
        setModalIsOpen(false);
        console.log("to delete complain api request hit");

        try{

            const response  = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/${complainId}`,{
                method : "DELETE",
                credentials: "include"
            });
            
            console.log(response.status);

            const responseData = await response.json();

            if(response.status ===200){
                alert(responseData.message);
                navigate("/");
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
            alert("Failed to delete complain.");
            return;

        }
    }

    return (
        <>
        <Modal show={modalIsOpen} onCancel={closeModal} onOk={deleteComplain} header={"Press OK to delete this complain"}>
            
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
        )}
        </>
    );
};

export default ComplainDetails;