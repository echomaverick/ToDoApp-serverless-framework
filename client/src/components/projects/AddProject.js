import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AddProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenTasks, setIsDropdownOpenTasks] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      const usersResponse = await axios.get(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users"
      );
      const tasksResponse = await axios.get(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks"
      );

      setAvailableUsers(usersResponse.data);
      setAvailableTasks(tasksResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectNameRegex = /^[A-Za-z\s]+$/;
    const projectDescriptionRegex = /^[A-Za-z\s]+$/;

    const newErrors = {};

    if (!projectNameRegex.test(name)) {
      newErrors.name = "Project name should only contain letters and spaces.";
    } else if (name.trim() !== "" && name[0] !== name[0].toUpperCase()) {
      newErrors.name = "Project name should start with an uppercase letter.";
    }

    if (!projectDescriptionRegex.test(description)) {
      newErrors.description =
        "Description should only contain letters and spaces.";
    } else if (
      description.trim() !== "" &&
      description[0] !== description[0].toUpperCase()
    ) {
      newErrors.description =
        "Description should start with an uppercase letter.";
    }

    if (selectedUsers.length === 0 || selectedTasks.length === 0) {
      newErrors.users = "Please select at least one user and one task.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    setErrors({});

    const projectData = {
      name,
      description,
      users: selectedUsers.map((user) => user._id),
      tasks: selectedTasks.map((task) => task._id),
    };

    try {
      const response = await axios.post(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/projects",
        projectData
      );
      console.log("Project added successfully:", response.data);
      setLoading(false);
      history.push("/projects");
    } catch (error) {
      setLoading(false);
      console.error("Error adding project:", error);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    clearError("name");
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((user) => user._id !== userId)
        : [
            ...prevSelectedUsers,
            availableUsers.find((user) => user._id === userId),
          ]
    );
  };

  const handleTaskToggle = (taskId) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((task) => task._id !== taskId)
        : [
            ...prevSelectedTasks,
            availableTasks.find((task) => task._id === taskId),
          ]
    );
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleDropdownToggleTasks = () => {
    setIsDropdownOpenTasks((prevState) => !prevState);
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers(availableUsers);
  };

  const handleUnselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const handleSelectAllTasks = () => {
    setSelectedTasks(availableTasks);
  };

  const handleUnselectAllTasks = () => {
    setSelectedTasks([]);
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const isButtonDisabled =
    !name ||
    !description ||
    selectedUsers.length === 0 ||
    selectedTasks.length === 0;

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="description" className="form-label">
              Project Name:
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Project Name"
              style={{ fontSize: "14px" }}
              value={name}
              onChange={handleNameChange}
              required
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description" className="form-label">
              Project Description:
            </label>
            <input
              type="text"
              id="description"
              className="form-control form-control-lg"
              placeholder="Enter Project Description"
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
                        onClick={handleSelectAllUsers}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleUnselectAllUsers}
                      >
                        Unselect All
                      </button>
                    </div>
                    <div
                      className="custom-dropdown-list"
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        width: "100%",
                      }}
                    >
                      {availableUsers.map((user) => (
                        <div key={user._id} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={user._id}
                            checked={selectedUsers.some(
                              (selectedUser) => selectedUser._id === user._id
                            )}
                            onChange={() => handleUserToggle(user._id)}
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
          <div className="form-group mb-3">
            <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary custom-dropdown-toggle"
                onClick={handleDropdownToggleTasks}
                style={{ width: "100%" }}
              >
                {selectedTasks.length === 0
                  ? "Select Tasks"
                  : `Selected Tasks (${selectedTasks.length})`}{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
              {isDropdownOpenTasks && (
                <div className="card custom-dropdown-content">
                  <div className="card-body">
                    <div className="d-flex justify-content-center mb-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm me-2"
                        onClick={handleSelectAllTasks}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleUnselectAllTasks}
                      >
                        Unselect All
                      </button>
                    </div>
                    <div
                      className="custom-dropdown-list"
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        width: "100%",
                      }}
                    >
                      {availableTasks.map((task) => (
                        <div key={task._id} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={task._id}
                            checked={selectedTasks.some(
                              (selectedTask) => selectedTask._id === task._id
                            )}
                            onChange={() => handleTaskToggle(task._id)}
                          />
                          <label className="form-check-label custom-dropdown-label">
                            {task.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.tasks && <div className="text-danger">{errors.tasks}</div>}
          </div>
          <div className="d-flex justify-content-start">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isButtonDisabled || loading}
            >
              Add Project
            </button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/projects")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
