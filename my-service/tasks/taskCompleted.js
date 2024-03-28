const mongoose = require("mongoose");
const connectDB = require("../config/dbConfig");
const Tasks = require("../models/taskModel");

module.exports.markTaskAsCompleted = async (event) => {
  console.log("Lambda function is invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const taskId = event.pathParameters.id;
    console.log("Task ID:", taskId);

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      console.log("Invalid task ID");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid task ID" }),
      };
    }

    const task = await Tasks.findById(taskId);
    if (!task) {
      console.log("Task not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    console.log("Marking task as completed...");
    task.completed = true;
    task.completedAt = new Date();

    const updatedTask = await task.save();
    console.log("Task marked as completed successfully.");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedTask),
    };
  } catch (error) {
    console.log("An error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to mark task as completed" }),
    };
  }
};
