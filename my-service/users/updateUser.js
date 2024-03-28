const AWS = require('aws-sdk');
const { CognitoIdentityServiceProvider } = AWS;
const connectDB  = require('../config/dbConfig');
const User = require('../models/userModel');

exports.updateUser = async (event) => {
  console.log("Lambda function invoked");

  try {
    console.log("Event:", JSON.stringify(event));
    const username = event.pathParameters.username;
    console.log("Username:", username);

    const updatedUserData = JSON.parse(event.body);
    console.log("Updated user data:", updatedUserData);

    if (!updatedUserData.name || !updatedUserData.surname) {
      console.log("Bad request: Missing name or surname");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and surname are required fields" }),
      };
    }

    await connectDB();
    console.log("Connected to the database");

    const mongoResponse =  User.updateOne({ username }, {
      name: updatedUserData.name,
      surname: updatedUserData.surname,
    });
    console.log("MongoDB response:", mongoResponse);

    console.log("User updated successfully in MongoDB");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "User updated successfully" }),
    };
  } catch (error) {
    console.error("An error occurred", error);
    
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || "An error occurred" }),
    };
  }
};
