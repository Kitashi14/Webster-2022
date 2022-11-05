import React from "react";
import { Link } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const LoginPage = ()=>{

    console.log("login page");
    
    const loginGoogleButtonHandler = async ()=>{

        try{
            console.log("fetching google auth link")
            const response = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/googleAuthlink`);

            const responseData = await response.json();
            
            const googleAuthUrl = responseData.url;

            window.location.replace(googleAuthUrl);

        }catch(err){
            console.log(err);
        }
    }
    return(
        <>
        <Container>
            <div>
                <input type="email" required/>
                <label>Email</label>
            </div>
            <br />
            <div>
                <input type="password" required/>
                <label>Password</label>
            </div>

            <div>
                <Link to="/verifyEmail">Create Account</Link> 
            </div>
            <div>
                <button onClick={loginGoogleButtonHandler}>Login with Google</button>
            </div>

        </Container>
        </>
    )
}

export default LoginPage;