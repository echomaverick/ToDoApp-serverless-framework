const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.deleteUser = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const userId = event.pathParameters.id;
    console.log("User ID", userId);

    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      console.log("User not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    await Tasks.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    );

    await Projects.updateMany({ users: userId }, { $pull: { users: userId } });

    console.log("User deleted successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "User deleted successfully." }),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while deleting the user",
      }),
    };
  }
};
