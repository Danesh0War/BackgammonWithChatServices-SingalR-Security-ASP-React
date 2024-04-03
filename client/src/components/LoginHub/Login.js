import React, { useRef } from "react";
import "./Style.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Slider from "./Slider";

// Component for the login page
const Login = ({ connection }) => {
  // Refs for DOM elements
  const container = useRef();
  const signInButton = useRef();
  const signUpButton = useRef();
  const signUp = useRef();

  // Function to handle sign-in button click event
  const signInClick = () =>
    signInButton.current.click(
      container.current.classList.remove("right-panel-active")
    );

  // Function to handle sign-up button click event
  const signUpClick = () =>
    signUpButton.current.click(
      container.current.classList.add("right-panel-active")
    );

  // Function to handle user login
  const loginUser = async (username, password) => {
    await connection.invoke("LoginUser", { username, password }); // Invokes the login operation
    await connection.invoke("LoadUsers"); // Loads the list of users after login
  };

  return (
    <div className="container" ref={container}>
      {/* Sign-in and sign-up components */}
      <SignIn loginUser={loginUser} />
      <SignUp
        connection={connection}
        signUp={signUp}
        signUpClick={signInClick}
      />
      {/* Slider component for switching between sign-in and sign-up */}
      <Slider
        signInButton={signInButton}
        signUpButton={signUpButton}
        signUpClick={signUpClick}
        signInClick={signInClick}
      />
    </div>
  );
};

export default Login;
