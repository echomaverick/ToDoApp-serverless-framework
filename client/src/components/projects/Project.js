import React, { useState, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Auth } from "aws-amplify";

const Projects = () => {
  const [projects, setProjects] = useState({
    name: "",
    description: "",
    users: [],
    tasks: [],
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const { id } = useParams();
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const idToken = currentUser.signInUserSession.idToken.jwtToken;
      const res = await axios.get(
        "https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/projects",{
          headers: {
            Authorization: idToken
          }
        }
      );
      setProjects(res.data);
      setLoading(false);

      if (id && objectIdRegex.test(id)) {
        const foundProject = res.data.find((project) => project._id === id);
        setSelectedProject(foundProject);
      } else {
        setSelectedProject(null);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching projects:", error);
    }
  };

  // if (!projects) {
  //   return <Redirect to="/not-found" />;
  // }

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          {/* <Link className="btn btn-primary" to="/projects">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go back to projects
          </Link> */}
          {selectedProject && (
            <Link
              to={`/user/${selectedProject.users[0].username}/projects`}
              className="btn btn-primary mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back to
              user projects
            </Link>
          )}
          <hr />
          <h2 className="border-bottom pb-3">Projects</h2>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : selectedProject ? (
            <div key={selectedProject._id} className="mb-4">
              <div className="card p-3 border-0">
                <h4>
                  <strong>Name:</strong> {selectedProject.name}
                </h4>
                <p>
                  <strong>Description:</strong> {selectedProject.description}
                </p>
                <p
                  className={
                    new Date(selectedProject.dueDate) < new Date()
                      ? "overdue"
                      : ""
                  }
                >
                  <strong>Project Date and Time:</strong>{" "}
                  {selectedProject.dueDate
                    ? new Date(selectedProject.dueDate).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="card border-0">
                    <div className="card-body">
                      <h5>Assigned Users:</h5>
                      {selectedProject.users.length > 0 ? (
                        <ul className="list-group">
                          {selectedProject.users.map((user) => (
                            <li key={user._id} className="list-group-item">
                              <p>
                                <strong>Name:</strong> {user.name}
                              </p>
                              <p>
                                <strong>Username:</strong> {user.username}
                              </p>
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No users assigned to this project.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0">
                    <div className="card-body">
                      <h5>Associated Tasks:</h5>
                      {selectedProject.tasks.length > 0 ? (
                        <ul className="list-group">
                          {selectedProject.tasks.map((task) => (
                            <li key={task._id} className="list-group-item">
                              <p>
                                <strong>Task title:</strong> {task.title}
                              </p>
                              <p>
                                <strong>Task description:</strong>{" "}
                                {task.description}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No tasks associated with this project.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No project found with the provided ID.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
