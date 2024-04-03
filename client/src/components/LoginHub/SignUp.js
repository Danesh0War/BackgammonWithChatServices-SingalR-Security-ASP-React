import React, { useState } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

const SignUp = ({ connection, signUp, signUpClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);

  const passwordsMatch = password === repassword;

  // Function to check unmet password policies
  const getUnmetPasswordPolicies = () => {
    const unmetPolicies = [];
    if (password.length < 8) unmetPolicies.push('Password must be at least 8 characters long.');
    if (!/[a-z]/.test(password)) unmetPolicies.push('Password must contain at least one lowercase letter.');
    if (!/[A-Z]/.test(password)) unmetPolicies.push('Password must contain at least one uppercase letter.');
    if (!/\d/.test(password)) unmetPolicies.push('Password must contain at least one digit.');
    if (!/\W/.test(password)) unmetPolicies.push('Password must contain at least one special character.');
    return unmetPolicies;
  };

  const registerUser = (e) => {
    e.preventDefault();
    const unmetPolicies = getUnmetPasswordPolicies();
    setSubmitClicked(true); // Indicate that a submit attempt has been made

    if (unmetPolicies.length === 0 && passwordsMatch) {
      // If all policies are met and passwords match, register the user
      connection.invoke("RegisterUser", { username, password });
      signUpClick();
    } else {
      // Show a browser alert with the list of unmet password policies
      alert(`Please address the following:\n\n${unmetPolicies.join('\n')}`);
    }
  };

  // Tooltip with password requirements
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.
    </Tooltip>
  );

  return (
    <Form className="form-container sign-up-container" onSubmit={registerUser}>
      <h2 className="formTitle">Sign Up</h2>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </OverlayTrigger>
        <Form.Control
          type="password"
          placeholder="Repeat Password"
          onChange={(e) => setRepassword(e.target.value)}
          isInvalid={submitClicked && !passwordsMatch} // Show invalid feedback only after submit
        />
        <Form.Control.Feedback type="invalid">
          Passwords do not match.
        </Form.Control.Feedback>
      </Form.Group>
      <button ref={signUp} type="submit" disabled={!username}>
        Sign Up
      </button>
    </Form>
  );
};

export default SignUp;
