// src/models/recipeModel.js
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    // Basic info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: null,
    },

    // Where this recipe came from
    sourceType: {
      type: String,
      enum: ["user", "edamam"],
      default: "user",
    },

    // If it came from Edamam, keep the URI so you can re-fetch if needed
    edamamUri: {
      type: String,
      default: null,
    },

    // Core cooking info
    ingredients: {
      type: [String], // e.g. ["1 cup broccoli", "200g pasta"]
      default: [],
    },

    instructions: {
      type: [String], // ["Boil water", "Add pasta", ...]
      default: [],
    },

    totalTime: {
      type: Number, // in minutes
      default: null,
    },

    servings: {
      type: Number,
      default: null,
    },

    // Diet preferences & allergens (useful for filtering + chatbot)
    dietLabels: {
      type: [String],
      default: [],
    },

    healthLabels: {
      type: [String],
      default: [],
    },

    // Who created/saved this recipe (optional for now)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
