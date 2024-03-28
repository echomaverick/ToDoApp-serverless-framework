const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      "mongodb+srv://<username>:<password>@your-cluster-uri/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
