const AWS = require("aws-sdk");
const mongoose = require('mongoose');
const User = require("../models/userModel");
const connectDB = require('../config/dbConfig');

require('dotenv').config();

connectDB();
console.log("Connected to the database");

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'your-region',
  params: {
    UserPoolId:'your-user-pool-id'
  }
});

module.exports.createUser = async (event) => {
  console.log("Lambda function invoked");

  try {
    const data = JSON.parse(event.body);
    console.log("Received data", data);

    const { name, surname, username, email, password, role } = data;

    if (!name || !surname || !username || !email || !password || !role) {
      console.log("All fields are required");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      console.log("Invalid name format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid name format! Name should only contain letters and spaces.",
        }),
      };
    }

    const surnameRegex = /^[A-Za-z\s]+$/;
    if (!surnameRegex.test(surname)) {
      console.log("Invalid surname format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid surname format! Surname should only letters and spaces.",
        }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email format!" }),
      };
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log("Invalid password format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid password format! Password must be at least 8 characters long and should contain at least one number, one letter and one symbol.",
        }),
      };
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("Username already exists");
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Username already exists! Try a different one.",
        }),
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return {
        statusCode: 409,
        body: JSON.stringify({
          error:
            "Email already exists! Try a different one or try to login to your account.",
        }),
      };
    }

    const params = {
      ClientId: 'your-client-id',
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "given_name",
          Value: name,
        },
        {
          Name: "family_name",
          Value: surname,
        },
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "preferred_username",
          Value: username,
        },
        {
          Name: "custom:role",
          Value: role.toString(),
        },
      ],
    };
    
    const signUpResponse = await cognito.signUp(params).promise();
    console.log("Cognito Sign-Up Response", signUpResponse);

    const newUser = new User({
      name,
      surname,
      username,
      email,
      role,
    });

    await newUser.save();

    const loginPath = "http://your-bucket-name.s3-website-us-west-2.amazonaws.com/login";
    return {
      statusCode: 302,
      headers: {
        Location: loginPath,
      },
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while registering the user",
      }),
    };
  }
};
