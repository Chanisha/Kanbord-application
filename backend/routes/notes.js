const express = require("express");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post(
  "/",
  [
    auth,
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("content")
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage("Content must be between 1 and 2000 characters"),
    body("category")
      .optional()
      .isIn(["Unassigned", "In Development", "Pending Review", "Done"])
      .withMessage("Invalid category"),
    body("priority")
      .optional()
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ],
  async (req, res) => {
    try {
      console.log("Creating note for user:", req.user?._id);
      console.log("Request body:", req.body);

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { title, content, category, priority, dueDate, tags } = req.body;

      const note = new Note({
        title,
        content,
        category: category || "Unassigned",
        priority: priority || "Medium",
        dueDate: dueDate || null,
        tags: tags || [],
        user: req.user._id,
      });

      console.log("Saving note:", note);
      await note.save();
      console.log("Note saved successfully:", note._id);

      res.status(201).json({
        message: "Note created successfully",
        note,
      });
    } catch (error) {
      console.error("Create note error:", error);
      res.status(500).json({
        message: "Server error during note creation",
      });
    }
  }
);

// @route   GET /api/notes
// @desc    Get all notes for the logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { category, priority, isCompleted, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotes: total,
        hasNext: skip + notes.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      message: "Server error while fetching notes",
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a specific note
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({ note });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({
      message: "Server error while fetching note",
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put(
  "/:id",
  [
    auth,
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("content")
      .optional()
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage("Content must be between 1 and 2000 characters"),
    body("category")
      .optional()
      .isIn(["Unassigned", "In Development", "Pending Review", "Done"])
      .withMessage("Invalid category"),
    body("priority")
      .optional()
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const note = await Note.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      // Update note fields
      const updateData = req.body;
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          note[key] = updateData[key];
        }
      });

      await note.save();

      res.json({
        message: "Note updated successfully",
        note,
      });
    } catch (error) {
      console.error("Update note error:", error);
      res.status(500).json({
        message: "Server error during note update",
      });
    }
  }
);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      message: "Server error during note deletion",
    });
  }
});

module.exports = router;
