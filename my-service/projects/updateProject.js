const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const mongoose = require("mongoose");

module.exports.updateProject = async (event) => {
  console.log("Lambda function invoked");
  try {

    await connectDB();
    console.log("Connected to the database");
    
    console.log(JSON.stringify(event));
    const projectId = event.pathParameters.id;
    console.log("Project ID", projectId);

    const { name, description, users, tasks, dueDate, completed } = JSON.parse(event.body);
    console.log("Request data", event.body);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log("Invalid project ID");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid project ID" }),
      };
    }

    const project = await Projects.findById(projectId);
    if (!project) {
      console.log("Project not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project ID does not exists" }),
      };
    }

    if (!name || !description || !users || !tasks) {
      console.log("Required fields missing");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "All field are required (name, description, users, projects)",
        }),
      };
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      console.log("Invalid name format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid name format! Name should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      console.log("Invalid description format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid description format! Description should only contain alphanumeric characters and spaces.",
        }),
      };
    }

    if (
      !Array.isArray(users) ||
      !users.every((usersId) => mongoose.Types.ObjectId.isValid(usersId))
    ) {
      console.log("Invalid 'users' field:", users);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid 'users' field. It should be an array of valid ObjectId.",
        }),
      };
    }

    project.name = name;
    project.description = description;
    project.users = users;
    project.tasks = tasks;
    project.completed = completed;

    if (dueDate && new Date(dueDate) >= new Date()) {
      project.dueDate = new Date(dueDate);
      console.log("Due date set for the project:", project.dueDate);
    }

    const updatedProject = await project.save();

    console.log("Project updated successfully.");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedProject),
    };
  } catch (error) {
    console.log("An error occurred while updating the project:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the project",
      }),
    };
  }
};
