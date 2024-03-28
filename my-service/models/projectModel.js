const mongoose = require("mongoose");

const projetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a project name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a project description"],
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Task",
    },
  ],
  dueDate: {
    type: Date,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Project", projetSchema);
