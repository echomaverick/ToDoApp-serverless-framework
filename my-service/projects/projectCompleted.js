const mongoose = require("mongoose");
const Projects = require("../models/projectModel");
const connectDB = require("../config/dbConfig");

module.exports.projectCompleted = async (event) => {
  console.log("Lambda function invoked");
  try {

    await connectDB();
    console.log("Connected to the database");

    const projectId = event.pathParameters.id;
    console.log("Project ID", projectId);

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
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    project.completed = true;
    project.completedAt = new Date();

    const updatedProject = await project.save();
    console.log("Project marked as completed:", updatedProject);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedProject),
    };
  } catch (error) {
    console.log("An error occurred", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to mark project as completed" }),
    };
  }
};
