const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getProjectById = async (event) => {
  console.log("Lambda function is invoked");

  try {
    const id = event.pathParameters.id;
    console.log("Project ID", id);

    await connectDB();
    console.log("Connected to the database");

    const project = await Projects.findById(id)
      .populate("users", "name surname username email")
      .populate("tasks", "title description");

    if (!project) {
      console.log("Project not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Project not found" }),
      };
    }

    console.log("Retrieved project:", project);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(project),
    };
  } catch (error) {
    console.log("An error occurred while retreiving the project", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while retreiving the project",
      }),
    };
  }
};
