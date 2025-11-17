// src/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
  
  
  //preferences for recipes/chatbot
  diets: {
      type: [String],
      default: [], // e.g. ["vegan", "gluten-free"]
    },

    allergens: {
      type: [String],
      default: [], // e.g. ["peanut", "shrimp"]
    },

    maxCookTime: {
      type: Number, // in minutes, e.g. 30
      default: null,
    },
  },
  
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);

