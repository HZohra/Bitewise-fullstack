// src/services/userService.js
import { User } from "../models/userModel.js";

/**
 * Create a new user in MongoDB.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.passwordHash
 * @returns {Promise<Object>} created user document
 */
export async function createUser({ name, email, passwordHash }) {
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return user;
}

/**
 * Find a user by email (for login, duplicates check).
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export async function findUserByEmail(email) {
  const user = await User.findOne({ email: email.toLowerCase() }).exec();
  return user;
}

/**
 * Find a user by MongoDB ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function findUserById(id) {
  const user = await User.findById(id).exec();
  return user;
}
