import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

const EditUser = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();

      const userSession = currentUser.getSignInUserSession();

      if (userSession) {
        const attributes = currentUser.attributes;

        setUser({
          name: attributes.given_name || "",
          surname: attributes.family_name || "",
          username: attributes.preferred_username || "",
          email: attributes.email || "",
          role: attributes.role || "",
        });
      } else {
        console.log('User is not authenticated.');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateUserAttributes = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();

      const userSession = currentUser.getSignInUserSession();

      if (userSession) {
        const updatedAttributes = {
          given_name: user.name,
          family_name: user.surname,
        };

        const updatedUser = await Auth.updateUserAttributes(currentUser, updatedAttributes);

        console.log('User attributes updated successfully:', updatedUser);
      } else {
        console.log('User is not authenticated.');
      }
    } catch (error) {
      console.error('Error updating user attributes:', error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const username = user.username;

      const idToken = localStorage.getItem("idToken");

      const headers = {
        Authorization: idToken,
      };

      const mongoResponse = await axios.put(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users/update-profile/${username}`,
        user,
        { headers }
      );

      if (mongoResponse.status === 200) {
        console.log("User profile updated successfully in MongoDB");
        await updateUserAttributes();

        await fetchUserData();
      } else {
        console.log("Failed to update user profile");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Update your profile info</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Name"
              name="name"
              value={user.name}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Surname"
              name="surname"
              value={user.surname}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={user.email}
              onChange={onInputChange}
              disabled
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              value={user.role}
              disabled
              hidden
            />
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn btn-primary me-2">Update info</button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/")}
            >
              Cancel
            </button>
          </div>
        </form>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;

