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

    // NEW FIELDS
    birthDate: {
      type: Date,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // preferences for recipes/chatbot
    diets: {
      type: [String],
      default: [],
    },

    allergens: {
      type: [String],
      default: [],
    },

    maxCookTime: {
      type: Number,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
