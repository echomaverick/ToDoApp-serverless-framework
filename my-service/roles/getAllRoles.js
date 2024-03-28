const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllRoles = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const roles = await Role.find({}).populate("users");

    console.log("Roles retreived successfully");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(roles),
    };
  } catch (error) {
    console.log(
      "An error occurred while retreiving the roles from the server",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while retreiving the roles from the server",
      }),
    };
  }
};
