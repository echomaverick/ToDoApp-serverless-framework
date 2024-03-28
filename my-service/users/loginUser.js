const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

const headersComponent = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": true,
};

module.exports.loginUser = async (event) => {
  console.log("Lambda function invoked");
  try {
    console.log(JSON.stringify(event));
    
    const requestBody = JSON.parse(event.body);

    console.log("Username from request:", requestBody.username);
    console.log("Password from request:", requestBody.password);

    const authParams = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: 'your-client-id',
      AuthParameters: {
        USERNAME: requestBody.username,
        PASSWORD: requestBody.password,
      },
    };
    

    const authResult = await cognito.initiateAuth(authParams).promise();

    console.log("Authentication result", authResult);

    const accessToken = authResult.AuthenticationResult.AccessToken;

    const params = {
      AccessToken: accessToken,
    };

    try {
      const result = await cognito.getUser(params).promise();

      console.log("User information", result);

      return {
        statusCode: 200,
        headers: headersComponent,
        body: JSON.stringify({ message: "Hello, " + result.Username }),
      };
    } catch (authError) {
      console.log("Authentication error", authError);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid or expired token" }),
      };
    }
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing the request" }),
    };
  }
};
