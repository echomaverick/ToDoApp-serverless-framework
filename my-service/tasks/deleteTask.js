const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.deleteTask = async (event) => {
  console.log("Lambda function invoked");
  
  try {

    await connectDB();
    console.log("Connected to the database");

    console.log(JSON.stringify(event));
    const taskId = event.pathParameters.id;
    console.log("Task ID:", taskId);

    const deletedTask = await Tasks.findByIdAndDelete(taskId);
    console.log("Deleted task:", deletedTask);

    if (!deletedTask) {
      console.log("Task not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    await User.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    await Projects.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    console.log("Task deleted successfully.");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Task deleted successfully." }),
    };
  } catch (error) {
    console.log("An error occurred while deleting the task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while deleting the task",
      }),
    };
  }
};
