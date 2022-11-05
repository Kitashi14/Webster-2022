import { Link } from "react-router-dom";

const Navbar = (props) => {

    const submitLogout = ()=>{
        console.log("logout function called");
        //auth.logout();
    }
  return (
    <div className="navbar-main-div">
      {props.login ? (
        <>
          <Link to="./login">
            <div>Log In</div>
          </Link>
        </>
      ) : (
        <>
            <Link  onClick={submitLogout} >
                <div>Log Out</div>
            </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
