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

                const response  = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/getDetails/${username}/${profession}`,{
                    credentials: "include"
                });
                
                console.log(response.status);

                const responseData = await response.json();
                console.log(responseData);
                if(response.status ===200){
                    setDetails(responseData.data.details);
                    setIsOwner(responseData.data.isVerifiedUser);
                    return;
                }
                else if(response.status===400){
                    alert(responseData.error);
                    navigate(`/user/${username}`);
                    return;
                }
                else if(response.status ===500){
                    throw Error(responseData.error);
                }
            }catch(err){
                console.log(err);
                alert("Failed to fetch worker details.");
                navigate(`/user/${username}`);

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

            const response = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/worker/delete/${username}/${profession}`,{
                method: "DELETE",
                credentials: "include"
            });

            const responseData = response.json();

            if(response.status===200){
                alert("Profession deleted successfully");
                console.log(responseData.data);
                navigate(`/user/${username}`);
            }
            else if(response.status ===400 || response.status===500){
                alert(responseData.error);
                closeModal();
            }
            
        }catch(err){
            console.log(err);
            alert("Failed to delete profession.");
            closeModal();
            return;

        }
    }

    return (
        <>
{/* Create a profile page UI */}

<div className="m-4 p-2 ">

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
        </div>

        
        </>
    );
};

export default WorkerProfile;