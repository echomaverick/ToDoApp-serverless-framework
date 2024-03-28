import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

const AddUserTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const[user, setUser] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleRegex = /^[A-Za-z\s]+$/;
    const descriptionRegex = /^[A-Za-z\s]+$/;

    const newErrors = {};

    if (!titleRegex.test(title)) {
      newErrors.title = "Task title should only contain letters and spaces.";
    } else if (title.trim() !== "" && title[0] !== title[0].toUpperCase()) {
      newErrors.title = "Task title should start with an uppercase letter.";
    }

    if (!descriptionRegex.test(description)) {
      newErrors.description =
        "Task description should only contain letters and spaces.";
    } else if (
      description.trim() !== "" &&
      description[0] !== description[0].toUpperCase()
    ) {
      newErrors.description =
        "Task description should start with an uppercase letter.";
    }

    const currentDate = new Date();
    const selectedDueDate = new Date(dueDate);
    if (selectedDueDate < currentDate) {
      newErrors.dueDate = "Due date cannot be in the past!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const username = currentUser.attributes.preferred_username;
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      console.log(idToken);
      const tasksResponse = await axios.post(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks",
        {
          title,
          description,
          assignedTo: username, 
          dueDate,
        },{
          headers:{
            Authorization: idToken
          }
        }
      );
      console.log("Task Response:", tasksResponse);
      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      console.error("Error adding task:", error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    clearError("title");
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const isButtonDisabled = !title || !description;

  const handleCancel = () => {
    history.goBack();
  };

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
            <label htmlFor="dueDate" className="form-label">
              Due Date and Time
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              className="form-control form-control-lg"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            {errors.dueDate && (
              <div className="text-danger">{errors.dueDate}</div>
            )}
          </div>
          <div className="d-flex justify-content-start">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isButtonDisabled || loading}
            >
              Add Task
            </button>
            <button className="btn btn-primary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserTask;
