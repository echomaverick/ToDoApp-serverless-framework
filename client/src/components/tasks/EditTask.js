import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams, Redirect } from "react-router-dom";
import "../styles/edittask.css";
import { Auth } from "aws-amplify";

const EditTask = () => {
  let history = useHistory();
  const { id } = useParams();
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [notFound, setNotFound] = useState(false);
  const [taskProjects, setTaskProjects] = useState([]);

  const { title, description } = task;

  useEffect(() => {
    loadTask();
    loadTaskProjects();
    loadCurrentUser(); // Load task projects when the component mounts
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const isEmpty = (value) => value.trim() === "";

  const isFormValid = () => {
    const errors = {
      title: isEmpty(title) ? "Task title is required." : "",
      description: isEmpty(description) ? "Task description is required." : "",
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
      const username = currentUser.attributes.preferred_username;
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      console.log(currentUser);

      await axios.put(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks/update/${id}`,
        {
          ...task,
          assignedTo: username,
        }, {
          headers: {
            Authorization: idToken
          }
        }
      );

      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      console.error("Error updating task:", error);
    }
  };

  const loadTask = async () => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      setNotFound(true);
      return;
    }

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      const result = await axios.get(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks/${id}`, {
          headers: {
            Authorization: idToken
          }
        }
      );
      if (!result.data) {
        setNotFound(true);
        return;
      }

      setTask({
        title: result.data.title,
        description: result.data.description,
      });
    } catch (error) {
      console.error("Error loading task:", error);
      setNotFound(true);
    }
  };

  const loadTaskProjects = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      const result = await axios.get(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/task/${id}/projects`, {
          headers: {
            Authorization: idToken
          }
        }
      );
      setTaskProjects(result.data);
      console.log("Task projects", result.data);
    } catch (error) {
      console.error("Error loading task projects:", error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const username = currentUser.attributes.preferred_username;
      setTask((prevTask) => ({
        ...prevTask,
        assignedTo: username,
      }));
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  if (notFound) {
    return <Redirect to="/not-found" />;
  }

  return (
    <div className="container">
      <div className="shadow p-5">
        <h2 className="text-center mb-4">Edit Task</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              id="title"
              placeholder="Enter Task Title"
              name="title"
              value={title}
              onChange={onInputChange}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
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
              placeholder="Enter Task Description"
              name="description"
              value={description}
              onChange={onInputChange}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="projects" className="form-label">
              Projects Assigned:
            </label>
            <div className="project-list">
              {taskProjects.length === 0 ? (
                <p>No projects assigned to this task.</p>
              ) : (
                <ul>
                  {taskProjects.map((project) => (
                    <li key={project._id}>{project.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-start">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
            <button className="btn btn-primary" onClick={handleCancel}>
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

export default EditTask;
