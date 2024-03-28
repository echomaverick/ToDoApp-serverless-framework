import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      const usersResponse = await axios.get(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users"
      );
      setAvailableUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskNameRegex = /^[A-Za-z\s]+$/;
    const taskDescriptionRegex = /^[A-Za-z\s]+$/;

    const newErrors = {};

    if (!taskNameRegex.test(title)) {
      newErrors.title = "Task title should only contain letters and spaces.";
    } else if (title.trim() !== "" && title[0] !== title[0].toUpperCase()) {
      newErrors.title = "Task title should start with an uppercase letter.";
    }

    if (!taskDescriptionRegex.test(description)) {
      newErrors.description =
        "Task description should only contain letters and spaces.";
    } else if (
      description.trim() !== "" &&
      description[0] !== description[0].toUpperCase()
    ) {
      newErrors.description =
        "Task description should start with an uppercase letter.";
    }

    if (selectedUsers.length === 0) {
      newErrors.users = "Please select at least one user.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    const taskData = {
      title,
      description,
      assignedTo: selectedUsers,
    };

    const idToken = user.signInUserSession.idToken.jwtToken;
    console.log(idToken);
    try {
      await axios.post(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks",
        taskData, {
          headers: {
            Authorization: idToken
          }
        }
      );
      setLoading(false);
      history.push("/tasks");
    } catch (error) {
      setLoading(false);
      console.error("Error adding task:", error);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    clearError("title");
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const handleUserToggle = (user) => () => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user._id)
        ? prevSelectedUsers.filter((id) => id !== user._id)
        : [...prevSelectedUsers, user._id]
    );
    clearError("users");
  };

  const handleSelectAll = () => {
    setSelectedUsers(availableUsers.map((user) => user._id));
    clearError("users");
  };

  const handleUnselectAll = () => {
    setSelectedUsers([]);
    clearError("users");
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const isButtonDisabled = !title || !description || selectedUsers.length === 0;

  const history = useHistory();

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">
              Task Title:
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Task Title"
              style={{ fontSize: "14px" }}
              value={title}
              onChange={handleTitleChange}
              required
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description" className="form-label">
              Task Description:
            </label>
            <input
              type="text"
              id="description"
              className="form-control form-control-lg"
              placeholder="Enter Task Description"
              style={{ fontSize: "14px" }}
              value={description}
              onChange={handleDescriptionChange}
              required
            />
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="users" className="form-label">
              Select Users:
            </label>
            <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary custom-dropdown-toggle"
                onClick={handleDropdownToggle}
                style={{ width: "100%" }}
              >
                {selectedUsers.length === 0
                  ? "Select Users"
                  : `Selected Users (${selectedUsers.length})`}{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
              {isDropdownOpen && (
                <div className="card custom-dropdown-content">
                  <div className="card-body">
                    <div className="d-flex justify-content-center mb-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm me-2"
                        onClick={handleSelectAll}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleUnselectAll}
                      >
                        Unselect All
                      </button>
                    </div>
                    <div
                      className="custom-dropdown-user-list"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {availableUsers.map((user) => (
                        <div key={user._id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={user._id}
                            checked={selectedUsers.includes(user._id)}
                            onChange={handleUserToggle(user)}
                          />
                          <label className="form-check-label custom-dropdown-label">
                            {user.name} {user.surname}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.users && <div className="text-danger">{errors.users}</div>}
          </div>
          <div className="d-flex justify-content-start">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isButtonDisabled || loading}
            >
              Add Task
            </button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/tasks")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
