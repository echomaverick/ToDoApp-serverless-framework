const { default: mongoose } = require("mongoose");
const connectDB = require("../config/dbConfig");
const Projects = require("../models/projectModel");
const Tasks = require("../models/taskModel");

module.exports.getProjectsForTasks = async (event) => {
  console.log("Lambda function is invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const taskId = event.pathParameters.id;
    console.log("Task ID", taskId);

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid Task ID" }),
      };
    }

    const projects = await Projects.find({ tasks: taskId });
    console.log("Fetched associated projects successfully", projects);

    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.error("Error in fetching associated projects", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error in fetching associated projects",
      }),
    };
  }
};
