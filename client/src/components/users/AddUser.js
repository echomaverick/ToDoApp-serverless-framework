import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/popup.css";
import {Auth} from "aws-amplify";

const AddUser = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users"
        );
        const users = usersResponse.data;
        setExistingEmails(users.map((user) => user.email.toLowerCase()));
        setExistingUsernames(users.map((user) => user.username.toLowerCase()));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const areAllFieldsFilled = () => {
    return (
      name.trim() !== "" &&
      surname.trim() !== "" &&
      username.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== ""
    );
  };

  const isPasswordValid = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
  
    const nameSurnameRegex = /^[A-Z][A-Za-z]{2,}$/;
    if (!nameSurnameRegex.test(name)) {
      newErrors.name =
        "Name should be at least 3 characters long and start with a capital letter and contain only alphabetic characters.";
    }
    if (!nameSurnameRegex.test(surname)) {
      newErrors.surname =
        "Surname should be at least 3 characters long and start with a capital letter and contain only alphabetic characters.";
    }
  
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (existingEmails.includes(email.toLowerCase())) {
      newErrors.email = "This email address already exists in the database.";
    }
  
    if (username.trim() === "" || username === "1234") {
      newErrors.username =
        "Username should contain at least one letter, be at least 3 characters long.";
    } else if (existingUsernames.includes(username.toLowerCase())) {
      newErrors.username = "This username already exists in the database.";
    }
  
    if (!isPasswordValid()) {
      newErrors.password =
        "Password should be 8 characters long and contain at least one letter, one symbol, and one number.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    setFormSubmitting(true);
  
    try {
      const signupResponse = await Auth.signUp({
        username: username,
        password,
        attributes: {
          email,
          name,
          surname,
        },
      });
  
      console.log("Signup response:", signupResponse);
  
      const response = await axios.post(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users", 
        {
          cognitoUserId: signupResponse.userSub, 
          name,
          surname,
          username,
          email,
        }
      );
  
      console.log("User added successfully:", response.data);
      setFormSubmitting(false);
      setShowSuccessModal(true);
  
      history.push("/login");
    } catch (error) {
      setFormSubmitting(false);
      console.error("Error adding user:", error);
    }
  };
  

  const handleNameChange = (e) => {
    setName(e.target.value);
    clearError("name");
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value);
    clearError("surname");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    clearError("username");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearError("email");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError("password");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    clearError("confirmPassword");
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="shadow p-5">
            <h2 className="text-center mb-4">Add user</h2>
            {errors.adminRole && (
              <div className="alert alert-danger">{errors.adminRole}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="name"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={handleNameChange}
                />
                {errors.name && (
                  <div className="text-danger">{errors.name}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="surname" className="form-label">
                  Surname:
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="surname"
                  placeholder="Enter Your Surname"
                  value={surname}
                  onChange={handleSurnameChange}
                />
                {errors.surname && (
                  <div className="text-danger">{errors.surname}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="username" className="form-label">
                  Username:
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="username"
                  placeholder="Enter Your Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail Address:
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  placeholder="Enter Your E-mail Address"
                  value={email}
                  onChange={handleEmailChange}
                />
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="confirmPassword"
                  placeholder="Confirm Your Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {errors.confirmPassword && (
                  <div className="text-danger">{errors.confirmPassword}</div>
                )}
              </div>
              <div className="d-flex justify-content-start">
                <button
                  type="submit"
                  className="btn btn-primary me-2 btn-sm"
                  disabled={!areAllFieldsFilled() || formSubmitting}
                >
                  Add user
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className="popup">
          <div className="popup-shadow">
            <h3>User Created</h3>
            <p>User created successfully!</p>
            <button onClick={handleCloseSuccessModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
