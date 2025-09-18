const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Note title is required"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  content: {
    type: String,
    required: [true, "Note content is required"],
    trim: true,
    maxlength: [2000, "Content cannot be more than 2000 characters"],
  },
  category: {
    type: String,
    enum: ["Unassigned", "In Development", "Pending Review", "Done"],
    default: "Unassigned",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  dueDate: {
    type: Date,
    default: null,
  },
  tags: [
    {
      type: String,
      trim: true,
      maxlength: [20, "Tag cannot be more than 20 characters"],
    },
  ],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Note must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
noteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({ user: 1, isCompleted: 1 });

module.exports = mongoose.model("Note", noteSchema);
