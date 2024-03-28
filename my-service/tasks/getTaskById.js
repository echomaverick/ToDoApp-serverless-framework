const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.getTaskById = async (event) => {
  console.log("Lambda function invoked");

  try {
    const id = event.pathParameters.id;
    console.log("Task ID:", id);
    await connectDB();
    console.log("Connected to the database");

    console.log("Fetching task from the database...");
    const task = await Tasks.findById(id)
      .populate("assignedTo", "name surname username email")
      .populate("projects", "name description");

    if (!task) {
      console.log("Task not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    console.log("Task retrieved successfully.");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(task),
    };
  } catch (error) {
    console.log("An error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while retreiving the task",
      }),
    };
  }
};
