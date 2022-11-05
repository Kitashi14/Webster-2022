import { Route, Routes } from "react-router-dom";
import CreateAccountPage from "./Pages/Authentication/CreateAccountPage";
import EmailVerifyPage from "./Pages/Authentication/EmailVerifyPage";
import LoginPage from "./Pages/Authentication/LoginPage";
import VerifyOTP from "./Pages/Authentication/VerifyOtp";
import LandingPage from "./Pages/LandingPage";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<><Navbar login={true} /><LandingPage /></>} />

        <Route exact path="/login" element={<LoginPage />} />

        <Route exact path="/verifyEmail" element={<EmailVerifyPage />}/>

        <Route exact path="/verifyOtp" element={<VerifyOTP />}/>

        <Route exact path="/createAccount" element={<CreateAccountPage />} />

        <Route exact path="/forgotPassword"></Route>

      </Routes>
    </>
  );
}

export default App;
