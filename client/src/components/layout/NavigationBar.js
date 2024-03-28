import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import axios from "axios";
import '../styles/navbar.css';

const NavigationBar = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching the user data", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
      setUser(null);
      history.push("/");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  
  return (
    <div className="navbar">
      <div className="navbar__left">
        <div className="navbar__logo">
          <Link to="/" className="logo">
            Proventus Nexus
          </Link>
        </div>
      </div>
      <div className="navbar__right">
        <div className="navbar__rightItem">
          {user && (
            <div className="list">
              <div className="listItem">
                Welcome, {user.username}
              </div>
              <Link to={`/user/${user.username}/tasks`} className="listItem">
                Tasks
              </Link>
              <Link to={`/user/${user.username}/projects`} className="listItem">
                Projects
              </Link>
              <Link to={`/users/update-profile/${user.attributes.preferred_username}`} className="listItem">
                Update your profile
              </Link>
              <button className="listItem button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
          {!user ? (
            <div className="list">
              <Link to="/login" className="listItem">
                Login
              </Link>
              <Link to="/signup" className="listItem">
                Signup
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
};

export default NavigationBar;
