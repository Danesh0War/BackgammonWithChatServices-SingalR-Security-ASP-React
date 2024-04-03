// Functional component for the sign-in/sign-up slider

const Slider = ({ signInButton, signInClick, signUpButton, signUpClick }) => {
  return (
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>Sign In</h1>
          <p> Login to your account<br></br><br></br>to start playing!</p>
          
          <button
            className="ghost"
            id="signIn"
            ref={signInButton}
            onClick={signInClick}
          >
            Sign In
          </button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1>Sign Up</h1>
          <p>Register to our website<br></br>to start playing!</p>
          <button
            className="ghost"
            id="signUp"
            ref={signUpButton}
            onClick={signUpClick}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
