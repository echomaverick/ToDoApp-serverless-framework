import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../styles/userTasks.css';
import { Auth } from "aws-amplify";

const TaskCard = ({ task, onDelete, markTaskAsCompleted }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async() => {
    try{
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      await axios.delete(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks/delete/${task._id}`, {
          headers: {
            Authorization: idToken
          }
        }
      );
      console.log("Task deleted", task._id);
      onDelete(task._id);
    }catch(error){
      console.error("Error deleting task", error);
    }
  };


  const markAsCompleted = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      await axios.put(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/tasks/${task._id}/completed`,
        {
          completed: true,
          dueDate: new Date(),
        }, {
          headers: {
            Authorization: idToken
          }
        }
      );
      console.log("Task marked as completed:", task._id);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  return (
    <div className="user-task-card">
      <div className="card-body">
        <div className="task-title">
          <h5 className="card-title">
            <strong>Title:</strong> {task.title}
          </h5>
        </div>
        <div className="task-description">
          <p className="card-text">
            <strong>Description:</strong> {task.description}
          </p>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between rounded-bottom">
          <div className="buttons-group">
            <Link
              className={`view-task-button ${
                task.completed ? "disabled" : ""
              }`}
              to={`/tasks/${task._id}`}
              disabled={task.completed}
            >
              View
            </Link>
            <Link
              className={`edit-task-button ${
                task.completed ? "disabled" : ""
              }`}
              to={`/tasks/edit/${task._id}`}
              disabled={task.completed}
            >
              Edit
            </Link>
            <button
              className="delete-task-button"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="completed-task-button"
              onClick={markAsCompleted}
              disabled={task.completed}
            >
              Completed
            </button>
          </div>
        {showConfirmation && <div className="popup-shadow"></div>}
      </div>
    </div>
  );
};

const UserTasks = ({ match }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = match.params;

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const idToken = currentUser.signInUserSession.idToken.jwtToken;
        const response = await axios.get(
          `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/user/${username}/tasks`, {
            headers: {
              Authorization: idToken
            }
          }
        );
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [username]);

  const onDeleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== taskId)
    );
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="user-task">Tasks for {username}</h2>
        <Link className="add-task-button" to="/tasks">
          Add Task
        </Link>
      </div>
      <div className="row">
        {tasks.map((task) => (
          <div key={task._id} className="col-md-4 mb-4">
            <TaskCard
              task={task}
              onDelete={onDeleteTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTasks;
