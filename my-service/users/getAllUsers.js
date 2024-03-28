const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllUsers = async (event) => {
  console.log("Lambda function invoked");
  try {
    await connectDB();
    console.log("Connected to the database");

    const users = await User.find({})
      .populate("tasks", "title description")
      .populate("projects", "name description");

    console.log("Users retreived successfully");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(users),
    };

  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while retreiving the users from the server",
      }),
    };
  }
};
