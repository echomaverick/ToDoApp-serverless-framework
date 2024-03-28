const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getAllTasks = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    console.log("Fetching all tasks from the database...");
    const tasks = await Tasks.find({})
      .populate("assignedTo", "name surname username email")
      .populate("projects", "name description")
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
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    console.log("An error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "An error occurred while retreiving the tasks from the server.",
      }),
    };
  }
};
