/** @format */

import { Route, Routes, useLocation } from "react-router-dom";
import CreateAccountPage from "./Pages/Authentication/CreateAccountPage";
import EmailVerifyPage from "./Pages/Authentication/EmailVerifyPage";
import LoginPage from "./Pages/Authentication/LoginPage";
import VerifyOTP from "./Pages/Authentication/VerifyOtp";
import Navbar from "./Components/Navbar";
import { useContext, useEffect } from "react";
import AuthContext from "./context/auth-context";
import HomePage from "./Pages/HomePage";
import ResetPage from "./Pages/Authentication/ResetPage";
import About from "./Pages/AboutUs";
import Form from "./Pages/ComplainForm";
import ComplainDetails from "./Pages/ComplainDetails";
import Profile from "./Pages/Profile";
import WorkerProfile from "./Pages/WorkerProfile";
import Page404 from "./Pages/Page404";
import ChatPage from "./Pages/ChatPage";
import { useSocket } from "./socket/socket";
import ChatContext from "./context/chatContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useSocket();
  const auth = useContext(AuthContext);
  const chat = useContext(ChatContext);

  const location = useLocation(); 

  useEffect(() => {
    // execute on location change
    console.log("Location changed!", location.pathname);
    if(!location.pathname.includes("chat")){
      chat.setChatScreenUser(null);
    }
  }, [location,chat]);

  return auth.isLoading ? (
    <> Loading....</>
  ) : (
    <><ToastContainer 
    autoClose={1000}
    position={toast.POSITION.BOTTOM_RIGHT}
    hideProgressBar
    theme="light"
    />
      {!auth.isLoggedIn ? (
        <>
          <Navbar login={false} />

          <Routes>
            <Route
              exact
              path="/"
              element={
                <>
                  <HomePage />
                </>
              }
            />

            <Route exact path="/login" element={<LoginPage />} />

            <Route exact path="/verifyEmail" element={<EmailVerifyPage />} />

            <Route exact path="/verifyOtp" element={<VerifyOTP />} />

            <Route
              exact
              path="/createAccount"
              element={<CreateAccountPage />}
            />

            <Route exact path="/resetPassword" element={<ResetPage />}></Route>

            <Route exact path="/about" element={<About />}></Route>

            <Route exact path="/forgetpassword" element={<ResetPage />}></Route>
            <Route
              exact
              path="/complain/:cid"
              element={<ComplainDetails />}
            ></Route>
            <Route exact path="/user/:uid" element={<Profile />}></Route>
            <Route
              exact
              path="/worker/:uid/:profession"
              element={<WorkerProfile />}
            ></Route>
            <Route exact path="*" element={<Page404 />} />
          </Routes>
        </>
      ) : (
        <>
          <Navbar login={true} />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <>
                  <HomePage />
                </>
              }
            />
            <Route exact path="/registerComplain" element={<Form />}></Route>
            <Route
              exact
              path="/complain/:cid"
              element={<ComplainDetails />}
            ></Route>
            <Route exact path="/user/:uid" element={<Profile />}></Route>
            <Route
              exact
              path="/worker/:uid/:profession"
              element={<WorkerProfile />}
            ></Route>

            <Route exact path="/about" element={<About />}></Route>
            <Route exact path="/chat" element={<ChatPage />}></Route>
            <Route exact path="/chat/:uid" element={<ChatPage />}></Route>
            <Route exact path="*" element={<Page404 />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
