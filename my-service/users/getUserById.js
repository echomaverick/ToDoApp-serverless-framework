const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getUserById = async (event) => {
  console.log("Lmabda function is invoked");

  try {
    const id = event.pathParameters.id;
    console.log("User ID", id);
    await connectDB();
    console.log("Connected to database");

    const user = await User.findById(id)
      .populate("tasks", "title description")
      .populate("projects", "name description");

    if (!user) {
      console.log("User not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    console.log("User retrieved successfully");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while retreiving the user",
      }),
    };
  }
};
