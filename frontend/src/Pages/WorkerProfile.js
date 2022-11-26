import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/ui/Modal";
import BackDrop from "../Components/ui/Backdrop";

const WorkerProfile = () => {

    const username = useParams().uid;
    const profession = useParams().profession;
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [details, setDetails]  = useState({});
    const [isOwner, setIsOwner] = useState(false);
    console.log(details);
    console.log("isOwner:",isOwner);

    useEffect(()=>{
        const fetchWokerDetails = async ()=>{

            try{

                const response  = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/${username}/${profession}`,{
                    credentials: "include"
                });
                
                console.log(response.status);

                const responseData = await response.json();

                if(response.status ===200){
                    setDetails(responseData.data.worker);
                    setIsOwner(responseData.data.isVerifiedUser);
                    return;
                }
                else if(response.status===400){
                    alert(responseData.error);
                    navigate(`/${username}`);
                    return;
                }
                else if(response.status ===500){
                    throw Error(responseData.error);
                }
            }catch(err){
                console.log(err);
                alert("Failed to fetch worker details.");
                navigate(`/${username}`);

            }
        }

        fetchWokerDetails();

        
    },[username,navigate,profession]);

    const OpenDeleteModal = (e)=>{
        e.preventDefault();
        setModalIsOpen(true);
    }

    const closeModal = (e)=>{
        e.preventDefault();
        setModalIsOpen(false);
    }

    const deleteWorker = async()=>{
        setModalIsOpen(false);
        console.log("to delete worker api request hit");

        try{

            
        }catch(err){
            console.log(err);
            alert("Failed to delete profession.");
            return;

        }
    }

    return (
        <>
        <Modal show={modalIsOpen} onCancel={closeModal} onOk={deleteWorker} header={"Press OK to delete this profession"}>
            
        </Modal>
        {modalIsOpen ? <BackDrop onCancel={closeModal} /> : null}
        <div>
            {username} {profession}
        </div>

        {isOwner ? (
            <>
            <button onClick={OpenDeleteModal}>Delete</button>
            </>
        ): (
            <></>
        )}
        </>
    );
};

export default WorkerProfile;