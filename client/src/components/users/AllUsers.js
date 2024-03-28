import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/allusers.css";
import ReactLoading from "react-loading";
import Pagination from "react-bootstrap/Pagination";
import SkeletonUserCard from "./SkeletonUserCard";

const UserCard = ({ user, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(user._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {user.name} {user.surname}
        </h5>
        <p className="card-text">Username: {user.username}</p>
      </div>
      <div className="card-footer d-flex justify-content-between rounded-bottom">
        {showConfirmation ? (
          <div
            className="popup bg-white rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ width: "600px", minHeight: "200px" }}
          >
            <p className="confirmation-text" style={{ fontSize: "24px" }}>
              Are you sure you want to delete?
            </p>
            <div className="btn-group d-flex align-items-center">
              <button
                className="btn1 btn-danger btn-rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="btn1 btn-secondary btn-rounded ml-2"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="btn-group">
            <Link
              className="btn btn-primary btn-rounded"
              to={`/users/${user._id}`}
            >
              View
            </Link>
            <Link
              className="btn btn-outline-primary btn-rounded"
              to={`/users/edit/${user._id}`}
            >
              Edit
            </Link>
            <button
              className="btn btn-danger btn-rounded ml-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
        {showConfirmation && <div className="popup-shadow"></div>}
      </div>
    </div>
  );
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      setSearchResults(
        users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error loading users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users/${id}`
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the total number of pages
  const totalPages = searchTerm
    ? Math.ceil(searchResults.length / itemsPerPage)
    : Math.ceil(users.length / itemsPerPage);

  // Define the currentUsers variable
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = searchTerm
    ? searchResults.slice(indexOfFirstUser, indexOfLastUser)
    : users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="py-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-4">All Users</h1>
            <Link to="/user/add" className="btn btn-primary btn-rounded">
              Add a User
            </Link>
          </div>
          <div className="row mt-4">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
                <SkeletonUserCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="display-4">All Users</h1>
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
            />
            {searchTerm && (
              <button className="clear-btn" onClick={handleSearchClear}>
                Clear
              </button>
            )}
          </div>
          <Link to="/user/add" className="btn btn-primary btn-rounded">
            Add a User
          </Link>
        </div>
        <div className="row mt-4">
          {currentUsers.length === 0 ? (
            <div className="col-md-12 text-center">
              {searchTerm ? <h3>No users found</h3> : null}
            </div>
          ) : (
            currentUsers.map((user) => (
              <div className="col-md-6 col-lg-4 mb-4" key={user._id}>
                <UserCard user={user} onDelete={deleteUser} />
              </div>
            ))
          )}
        </div>
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item
              onClick={() => paginate(1)}
              active={currentPage === 1}
            >
              1
            </Pagination.Item>
            {currentPage > 2 && <Pagination.Ellipsis disabled />}
            {currentPage > 2 && (
              <Pagination.Item onClick={() => paginate(currentPage - 1)}>
                {currentPage - 1}
              </Pagination.Item>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <Pagination.Item active>{currentPage}</Pagination.Item>
            )}
            {currentPage < totalPages - 1 && (
              <Pagination.Item onClick={() => paginate(currentPage + 1)}>
                {currentPage + 1}
              </Pagination.Item>
            )}
            {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
            {currentPage < totalPages && (
              <Pagination.Item onClick={() => paginate(totalPages)}>
                {totalPages}
              </Pagination.Item>
            )}
            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
