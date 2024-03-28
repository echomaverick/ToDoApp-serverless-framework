import React, { useState, useEffect } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    projects: [],
    tasks: [],
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      setLoading(false);
      setUser(null);
      console.log("Invalid ID");
      return;
    }

    try {
      console.log("Fetching user data...");
      console.log(id);
      const res = await axios.get(
        `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/users/${id}`
      );

      if (res.status === 200) {
        console.log("User data:", res.data);
        setUser(res.data);

        if (res.data.role && res.data.role["$oid"]) {
          try {
            console.log("Fetching role data...");
            const roleRes = await axios.get(
              `https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/roles/${res.data.role["$_id"]}`
            );
            console.log("Role data:", roleRes.data);
            setUser((prevState) => ({ ...prevState, role: roleRes.data.name }));
          } catch (error) {
            console.error("Error loading role:", error);
            setUser((prevState) => ({ ...prevState, role: "Role Not Found" }));
          }
        } else {
          setUser((prevState) => ({ ...prevState, role: "Role ID Missing" }));
        }

        const userTaskIds = res.data.tasks.map((taskId) => taskId["$oid"]);
        const userTasks = tasks.filter((task) =>
          userTaskIds.includes(task._id["$oid"])
        );
        setTasks(userTasks);

        setLoading(false);
      } else if (res.status === 404) {
        setLoading(false);
        setUser(null);
      } else {
        console.error("Unexpected response status:", res.status);
        setLoading(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setLoading(false);
      setUser(null);
    }
  };

  if (!user) {
    return <Redirect to="/not-found" />;
  }

  return (
    <div className="container py-4">
      <div className={`card ${loading ? "d-none" : ""}`}>
        <div className="card-body">
          <Link className="btn btn-primary" to="/users">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back
            users
          </Link>
          <hr />

          <div className="card mb-4">
            <div className="card-body">
              <h4>User Information:</h4>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Surname:</strong> {user.surname}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h4>Tasks Assigned:</h4>
                  {user.tasks.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {user.tasks.map((task) => (
                        <li key={task["$_id"]} className="list-group-item">
                          <p>
                            <strong>Task title: </strong> {task.title}
                          </p>
                          <p>
                            <strong>Task description: </strong>{" "}
                            {task.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tasks assigned.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h4>Projects Assigned:</h4>
                  {user.projects.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {user.projects.map((project) => (
                        <li key={project["$_id"]} className="list-group-item">
                          <p>
                            <strong>Project name: </strong> {project.name}
                          </p>
                          <p>
                            <strong>Project description: </strong>{" "}
                            {project.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No projects assigned.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
