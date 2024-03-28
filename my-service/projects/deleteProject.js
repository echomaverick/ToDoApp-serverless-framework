const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.deleteProject = async (event) => {
  console.log("Lambda function invoked");

  try {

    await connectDB();
    console.log("Connected to the database");

    console.log(JSON.stringify(event));
    const projectId = event.pathParameters.id;
    console.log("Task ID:", projectId);

    const deletedProject = await Projects.findByIdAndDelete(projectId);
    console.log("Deleted task:", deletedProject);

    if (!deletedProject) {
      console.log("Project not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Project not found" }),
      };
    }

    await User.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    await Tasks.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    console.log("Project deleted successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Project deleted successfully" }),
    };
  } catch (error) {
    console.log("An error occurred while deleting the project", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the project",
      }),
    };
  }
};
