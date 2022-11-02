import React from "react";
import { Link } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const LoginPage = ()=>{


    console.log("login page");

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

        </Container>
        </>
    )
}

export default LoginPage;