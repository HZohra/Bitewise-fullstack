// src/models/chatHistoryModel.js
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    // Either link to a User document OR store an external ID string
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // For now you can keep the frontend user_id string here ("anonymous" or some ID)
    externalUserId: {
      type: String,
      default: null,
    },

    // "user" or "assistant"
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    // The actual text of the message
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional: store some extra metadata if you want later
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
