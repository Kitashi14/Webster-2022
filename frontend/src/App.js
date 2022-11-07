import { Route, Routes } from "react-router-dom";
import CreateAccountPage from "./Pages/Authentication/CreateAccountPage";
import EmailVerifyPage from "./Pages/Authentication/EmailVerifyPage";
import LoginPage from "./Pages/Authentication/LoginPage";
import VerifyOTP from "./Pages/Authentication/VerifyOtp";
import LandingPage from "./Pages/LandingPage";
import Navbar from "./Components/Navbar";
import { useContext } from "react";
import AuthContext from "./context/auth-context";
import HomePage from "./Pages/HomePage";

function App() {
  const auth = useContext(AuthContext);

  return !auth.isLoggedIn ? (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              {" "}
              <Navbar login={true} /> <LandingPage />{" "}
            </>
          }
        />

        <Route exact path="/login" element={<LoginPage />} />

        <Route exact path="/verifyEmail" element={<EmailVerifyPage />} />

        <Route exact path="/verifyOtp" element={<VerifyOTP />} />

        <Route exact path="/createAccount" element={<CreateAccountPage />} />

        <Route exact path="/forgotPassword"></Route>
      </Routes>
    </>
  ) : (
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
      </Routes>
    </>
  );
}

export default App;
