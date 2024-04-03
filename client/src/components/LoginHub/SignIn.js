import { useState } from "react";
import { Form } from "react-bootstrap";

// Functional component for the sign-in form

const SignIn = ({ loginUser }) => {
  // State variables for storing username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isValidPassword = password.length >= 8;


  return (
    <Form
      className="form-container sign-in-container"
      onSubmit={(e) => {
        e.preventDefault();  // Prevents default form submission behavior
        if (isValidPassword) {
          loginUser(username, password);
        } else {
          alert('Password does not meet the minimum length requirement.');
        } // Calls the loginUser function with username and password parameters
      }}
    >
      <h2 className="formTitle">Sign in</h2>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)} // Updates the username state on change
        />
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}  // Updates the password state on change
        />
      </Form.Group> 
      {/* Sign-in button */}
      <button type="submit" disabled={!username || !isValidPassword}>
        Sign In
      </button>
    </Form>
  );
};
export default SignIn;
