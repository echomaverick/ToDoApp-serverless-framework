const mongoose = require('mongoose');
const connectDB = require('../config/dbConfig');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const Projects = require('../models/projectModel');
const Roles = require('../models/roleModel');

module.exports.getTasksForUserByUsername = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const username = event.pathParameters.username;
    console.log("Username:", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    console.log("Fetching tasks for user...");
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('assignedTo', 'name surname username email')
      .populate('projects', 'name description');

    console.log("Tasks fetched successfully.");
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
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};
