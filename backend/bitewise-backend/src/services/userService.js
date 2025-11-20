// src/services/userService.js
import { User } from "../models/userModel.js";

/**
 * Create a new user in MongoDB.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.passwordHash
 * @param {Date|string} [params.birthDate]
 * @param {string} [params.phone]
 * @returns {Promise<Object>} created user document
 */
export async function createUser({ name, email, passwordHash, birthDate, phone }) {
  const user = await User.create({
    name,
    email,
    passwordHash,
    birthDate,
    phone,
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

/**
 * Update user preferences (diets, allergens, maxCookTime).
 */
export async function updateUserPreferences(userId, { diets, allergens, maxCookTime }) {
  const update = {};

  if (diets !== undefined) {
    update.diets = diets;
  }
  if (allergens !== undefined) {
    update.allergens = allergens;
  }
  if (maxCookTime !== undefined) {
    update.maxCookTime = maxCookTime;
  }

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true, // return updated document
  }).exec();

  return user;
}

/**
 * Update user password hash (used by change-password route).
 */
export async function updateUserPassword(userId, newPasswordHash) {
  const user = await User.findByIdAndUpdate(
    userId,
    { passwordHash: newPasswordHash },
    { new: true }
  ).exec();

  return user;
}
