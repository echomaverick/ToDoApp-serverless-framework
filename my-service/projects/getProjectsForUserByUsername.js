const Task = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Roles = require("../models/roleModel");
const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");

module.exports.getProjectsForUserByUsername = async (event) => {
  console.log("Lambda function is invoked");
  
  try {

    await connectDB();
    console.log("Connected to the database");

    const username = event.pathParameters.username;
    console.log("Username", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const projects = await Projects.find({ users: user._id })
      .populate("users", "name surname username email")
      .populate("tasks", "name description");
      console.log("Retrieved projects for user:", projects);

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
    console.log("An error occurred while retreiving the projects for the user", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while retreiving the projects for the user",
      }),
    };
  }
};