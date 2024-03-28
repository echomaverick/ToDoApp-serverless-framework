const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllProjects = async (event) => {
  console.log("Lambda function is invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    console.log("Fetching all tasks from the database...");
    const projects = await Projects.find({})
      .populate("users", "name surname username email")
      .populate("tasks", "title description")
      .exec();

    console.log("Tasks retrieved successfully.");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.log("An error while retreiving the projects from the server", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error while retreiving the projects from the server.",
      }),
    };
  }
};
