const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");
const mongoose = require("mongoose");

module.exports.updateTask = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    console.log(JSON.stringify(event));
    const taskId = event.pathParameters.id;
    console.log("Task ID", taskId);

    const { title, description, assignedTo, projects, completed, dueDate } =
      JSON.parse(event.body);
    console.log("Request data", event.body);

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      console.log("Task id is not correct");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid task ID" }),
      };
    }

    const task = await Tasks.findById(taskId);
    if (!task) {
      console.log("Task might be deleted");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task ID does not exist" }),
      };
    }

    // Check if the assigned user exists
    const existingUser = await User.findOne({ username: assignedTo });
    if (!existingUser) {
      console.log("Invalid user! User does not exist.");
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Invalid user! User does not exist.",
        }),
      };
    }

    task.title = title;
    task.description = description;
    task.projects = projects;
    task.assignedTo = [existingUser._id];
    task.completed = completed;

    if (dueDate && new Date(dueDate) >= new Date()) {
      task.dueDate = new Date(dueDate);
    }

    const updatedTask = await task.save();
    console.log("Task updated successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedTask),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update task" }),
    };
  }
};
