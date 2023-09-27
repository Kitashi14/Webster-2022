import { createContext, useEffect, useState } from "react";
import { socket } from "../socket/sc";

const AuthContext = createContext({
  isLoggedIn: false,
  userName: null,
  user: null,
  login: (user) => {},
  logout: () => {},
  isLoading : false
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const [user, setUser] = useState(null);

  const login = (user) => {
    setUserName(user.userName);
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      //sending request to server
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/logout`,
        {
          credentials: "include",
        }
      );
      socket.disconnect();
      const responseData = await response.json();

      if (response.status === 200) {
        console.log("logged out");
      } else throw Error(responseData.error);
    } catch (err) {
      console.log(err);
      alert("Can't delete logout token");
      return;
    }
    setIsLoggedIn(false);
    setUserName(null);
    setUser(null);
    window.location.replace(`${process.env.REACT_APP_CLIENT_ROOT_URI}`);
  };

  console.log("userName:", userName,user);

  console.log("isLogin:", isLoggedIn);
  useEffect(() => {
    const authLogin = async () => {
      setIsLoading(true);
      console.log("sending request to access token check api");

      //fetch request
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/authLogin`,
          {
            credentials: "include",
          }
        );
        const responseData = await response.json();

        if (response.status === 200) {
          console.log("access token verified successfully");
          //   console.log(responseData.userData);
          login(responseData.userData);
        } else if (response.status === 400) {
          console.log(responseData.error);
          if (isLoggedIn) {
            alert("Session timeout. Please login again");
            await logout();
          }
        } else {
          throw Error(responseData.error);
        }
      } catch (err) {
        console.log(err);
        if (isLoggedIn) {
          alert("Failed to authenticate");
          await logout();
        }
      }
      setIsLoading(false);
    };

    authLogin();
    // eslint-disable-next-line
  }, []);

  const context = {
    isLoggedIn: isLoggedIn,
    userName: userName,
    user: user,
    login: login,
    logout: logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
