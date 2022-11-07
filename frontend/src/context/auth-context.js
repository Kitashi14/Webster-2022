import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userName: null,
  user: null,
  login: (user) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [user, setUser] = useState(null);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
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
      const responseData = await response.json();

      if (response.status === 200) console.log("logged out");
      else throw Error(responseData.error);
    } catch (err) {
      console.log(err);
      alert("Can't delete logout token");
      return;
    }
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName(null);
    setUser(null);
  };

  console.log("userName:", userName);

  console.log("isLogin:", isLoggedIn);
  useEffect(() => {
    const authLogin = async () => {
      console.log("sending request to access token check api");

      //fetch request
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/authLogin`,
          {
            credentials: "include",
          }
        );

        console.log("response status:", response.status);
        const responseData = await response.json();

        if (response.status === 200) {
          console.log("access token verified successfully");
          //   console.log(responseData.userData);
          login(responseData.userData);
        } else if (response.status === 400) {
          console.log(responseData.error);
          if(isLoggedIn)alert("Session timeout. Please login again");
          logout();
          return;
        } else {
          throw Error(responseData.error);
        }
      } catch (err) {
        console.log(err);
        alert("Failed to authenticate");
        logout();
      }
    };

    authLogin();
  }, [isLoggedIn]);

  const context = {
    isLoggedIn: isLoggedIn,
    userName: userName,
    user: user,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;