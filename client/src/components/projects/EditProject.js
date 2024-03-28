import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";

const EditProject = () => {
  let history = useHistory();
  const { id } = useParams();
  const [project, setProject] = useState({
    name: "",
    description: "",
    users: [],
    tasks: [],
  });
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    users: "",
    tasks: "",
  });
  const [notFound, setNotFound] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isTaskDropdownOpen, setTaskDropdownOpen] = useState(false);

  const {
    name,
    description,
    users: selectedUsers,
    tasks: selectedTasks,
  } = project;

  const loadUsersAndTasks = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      const headers = {
        Authorization: idToken
      }

      const [usersResponse, tasksResponse] = await Promise.all([
        axios.get(
          "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users", {headers}
        ),
        axios.get(
          "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks", {headers}
        ),
      ]);
      setUsers(usersResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error("Error loading users and tasks:", error);
    }
  };

  useEffect(() => {
    loadProject();
    loadUsersAndTasks();
  }, []);

  const onInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "select-multiple"
        ? Array.from(e.target.selectedOptions).map((option) => option.value)
        : value;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: newValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const isAtLeastOneSelected = (array) => {
    return array.length > 0;
  };

  const isEmpty = (value) => value.trim() === "";

  const isFormValid = () => {
    const errors = {
      name: isEmpty(name) ? "Project name is required." : "",
      description: isEmpty(description)
        ? "Project description is required."
        : "",
      users: isAtLeastOneSelected(selectedUsers)
        ? ""
        : "At least one user should be selected.",
      tasks: isAtLeastOneSelected(selectedTasks)
        ? ""
        : "At least one task should be selected.",
    };
    setErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    setLoading(true);

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      await axios.put(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/projects/update/${id}`,
        {
          ...project,
          users: project.users,
          tasks: project.tasks,
        },  {
          headers: {
            Authorization: idToken
          }
        }
      );

      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      console.error("Error updating project:", error);
    }
  };

  const loadProject = async () => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      setNotFound(true);
      return;
    }

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      const result = await axios.get(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/projects/${id}`
      );
      if (!result.data) {
        setNotFound(true);
        return;
      }

      const userIDs = result.data.users.map((user) => user._id.toString());
      const taskIDs = result.data.tasks.map((task) => task._id.toString());
      setProject({
        name: result.data.name,
        description: result.data.description,
        users: userIDs,
        tasks: taskIDs,
      });
    } catch (error) {
      console.error("Error loading project:", error);
      setNotFound(true);
    }
  };

  const isAnyRequiredFieldEmpty = () => {
    return (
      !name.trim() ||
      !description.trim() ||
      !isAtLeastOneSelected(selectedUsers) ||
      !isAtLeastOneSelected(selectedTasks)
    );
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleTaskDropdownToggle = () => {
    setTaskDropdownOpen(!isTaskDropdownOpen);
  };

  const handleSelectAll = (event) => {
    const { name, options } = event.target;
    const allValues = Array.from(options).map((option) => option.value);
    setProject((prevProject) => ({
      ...prevProject,
      [name]: allValues,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUnselectAll = (event) => {
    const { name } = event.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: [],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  if (notFound) {
    return <Redirect to="/not-found" />;
  }

  const handleCancel = () =>{
    history.goBack();
  }

  return (
    <div className="container">
      <div className="shadow p-5">
        <h2 className="text-center mb-4">Edit Project</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="Enter Project Name"
              name="name"
              value={name}
              onChange={onInputChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              id="description"
              placeholder="Enter Project Description"
              name="description"
              value={description}
              onChange={onInputChange}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="users" className="form-label">
              Select Users:
            </label>
            <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary custom-dropdown-toggle"
                onClick={handleUserDropdownToggle}
                style={{ width: "100%" }}
              >
                {selectedUsers.length === 0
                  ? "Select Users"
                  : `Selected Users (${selectedUsers.length})`}{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
              {isUserDropdownOpen && (
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
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {users.map((user) => (
                        <div key={user._id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={user._id}
                            checked={selectedUsers.includes(user._id)}
                            onChange={onInputChange}
                            name="users"
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
          <div className="mb-3">
            <label htmlFor="tasks" className="form-label">
              Select Tasks:
            </label>
            <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary custom-dropdown-toggle"
                onClick={handleTaskDropdownToggle}
                style={{ width: "100%" }}
              >
                {selectedTasks.length === 0
                  ? "Select Tasks"
                  : `Selected Tasks (${selectedTasks.length})`}{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
              {isTaskDropdownOpen && (
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
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {tasks.map((task) => (
                        <div key={task._id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={task._id}
                            checked={selectedTasks.includes(task._id)}
                            onChange={onInputChange}
                            name="tasks"
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || isAnyRequiredFieldEmpty()}
          >
            Update Project
          </button>
          <button className="btn btn-primary" onClick={handleCancel}>
              Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
