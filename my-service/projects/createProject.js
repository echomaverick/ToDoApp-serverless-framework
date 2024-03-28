const connectDB = require("../config/dbConfig");
const User = require("../models/userModel");
const Tasks = require("../models/taskModel");
const Projects = require("../models/projectModel");
const Role = require("../models/roleModel");

module.exports.createProject = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const data = JSON.parse(event.body);
    const { name, description, users, tasks, dueDate } = data;
    console.log("Event body", event.body);

    if (!name || !description || !users) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Name, description, users are required fields",
        }),
      };
    }

    if (!dueDate || new Date(dueDate) < new Date()) {
      console.log("Invalid due date");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "The date of the project should not be on the past",
        }),
      };
    }

    const nameRegex = /^[A-Za-z0-9\s]+$/;
    if (!nameRegex.test(name)) {
      console.log("Invalid name format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid name format! Name should only contain letters and spaces",
        }),
      };
    }

    const descriptionRegex = /^[A-Za-z0-9\s]+$/;
    if (!descriptionRegex.test(description)) {
      console.log("Invalid description format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid description format! Description should only contain letter and spaces",
        }),
      };
    }

    const existingUser = await User.findById(users);
    if (!existingUser) {
      console.log("Invalid user ID");
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Invalid user ID! User does not exists",
        }),
      };
    }

    const newProject = new Projects({
      name,
      description,
      users,
      tasks,
      dueDate: new Date(dueDate),
    });
    await newProject.save();

    await User.updateMany(
      { _id: { $in: users } },
      { $push: { projects: newProject._id } }
    );

    await Tasks.updateMany(
      { _id: { $in: tasks } },
      { $push: { projects: newProject._id } }
    );

    console.log("Project created successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newProject),
    };
  } catch (error) {
    console.log("An error occurred while creating the project", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating the project",
      }),
    };
  }
};
