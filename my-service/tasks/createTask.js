const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.createTask = async (event) => {
  console.log("Lambda function invoked");
  try {
    await connectDB();
    console.log("Connected to the database");

    const data = JSON.parse(event.body);
    const { title, description, assignedTo, projects, dueDate } = data;
    console.log("Event body", event.body);

    if (!title || !description) {
      console.log("Title and description are required fields");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Title and description are required fields",
        }),
      };
    }

    if (!dueDate || new Date(dueDate) < new Date()) {
      console.log(
        "Date validation failed: The date of the task should not be in the past"
      );
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "The date of the task should not be in the past",
        }),
      };
    }

    const titleRegex = /^[A-Za-z0-9\s]+$/;
    if (!titleRegex.test(title)) {
      console.log("Invalid title format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid title format! Title should only contain letters and spaces",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z0-9\s]+$/;
    if (!descriptionRegex.test(description)) {
      console.log("Invalid description format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid description format! Description should only contain letters and spaces",
        }),
      };
    }

    const existingUser = await User.findOne({ username: assignedTo });
    if (!existingUser) {
      console.log("Invalid user! User does not exist.");
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Invalid user! User does not exist.",
        }),
      };
    }

    const newTask = new Tasks({
      title,
      description,
      assignedTo: [existingUser._id], // Assign the user based on their username
      projects,
      dueDate: new Date(dueDate),
    });
    await newTask.save();

    await User.updateMany(
      { _id: { $in: [existingUser._id] } },
      { $push: { tasks: newTask._id } }
    );

    await Projects.updateMany(
      { _id: { $in: projects } },
      { $push: { tasks: newTask._id } }
    );

    console.log("Task created successfully.");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newTask),
    };
  } catch (error) {
    console.log("An error occurred while creating the task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating the task",
      }),
    };
  }
};
