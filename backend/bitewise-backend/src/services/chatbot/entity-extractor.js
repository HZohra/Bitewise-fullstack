//Parsing user input to extract entities for chatbot actions

import fs from 'fs'; // For file system operations
import path from 'path'; // Added to handle file paths


const dietaryMappings = JSON.parse(fs.readFileSync(new URL('./data/dietary-mappings.json', import.meta.url), 'utf8')); // Dietary tags, meal types, time keywords
const allergenSignals = JSON.parse(fs.readFileSync(new URL('./data/allergen-signals.json', import.meta.url), 'utf8')); // Allergen signal words

export function extractEntities(text, profile = {}) {
  const lowerText = text.toLowerCase();
  const entities = {
    dietaryTags: [],
    foodTopic: '',
    timeLimit: null,
    mealType: '',
    duration: null,
    location: null,
    allergens: [],
    ingredients: []
  };

  // Extract dietary tags from text and user profile
  entities.dietaryTags = extractDietaryTags(lowerText, profile.diets || []);
  
  // Extract food topic 
  entities.foodTopic = extractFoodTopic(lowerText);
  
  // Extract time limit 
  entities.timeLimit = extractTimeLimit(lowerText);
  
  // Extract meal type
  entities.mealType = extractMealType(lowerText);
  
  // Extract duration for meal planning
  entities.duration = extractDuration(lowerText);
  
  // Extract location
  entities.location = extractLocation(lowerText, profile.location);
  
  // Extract allergens
  entities.allergens = extractAllergens(lowerText, profile.allergens || []);
  
  // Extract ingredients for substitution requests
  entities.ingredients = extractIngredients(lowerText);

  return entities;
}

function extractDietaryTags(text, userDiets = []) {
  const tags = [];
  const dietaryKeywords = Object.keys(dietaryMappings.dietaryTags);
  
  for (const keyword of dietaryKeywords) {
    if (text.includes(keyword)) {
      tags.push(dietaryMappings.dietaryTags[keyword]);
    }
  }
  
  // Add user's saved dietary preferences
  return [...new Set([...tags, ...userDiets])];
}

function extractFoodTopic(text) {
  // Common food-related keywords to remove
  const stopWords = ['recipe', 'food', 'meal', 'dish', 'cook', 'make', 'eat', 'dinner', 'lunch', 'breakfast', 'snack', 'healthy', 'quick', 'easy','brunch'];
  
  // Extract potential food topic by removing common words
  let topic = text;
  stopWords.forEach(word => {
    topic = topic.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
  });
  
  // Clean up extra spaces and return
  return topic.trim().replace(/\s+/g, ' ');
}

function extractTimeLimit(text) {
  const timePatterns = [
    { pattern: /(\d+)\s*min/i, multiplier: 1 },
    { pattern: /(\d+)\s*minute/i, multiplier: 1 },
    { pattern: /(\d+)\s*hour/i, multiplier: 60 },
    { pattern: /(\d+)\s*h/i, multiplier: 60 },
    { pattern: /under\s*(\d+)/i, multiplier: 1 },
    { pattern: /less\s*than\s*(\d+)/i, multiplier: 1 }
  ];
  
  for (const { pattern, multiplier } of timePatterns) { // Check each pattern
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]) * multiplier;
    }
  }
  
  // Check for keyword-based time limits
  for (const [keyword, minutes] of Object.entries(dietaryMappings.timeKeywords)) {
    if (text.includes(keyword) && minutes) {
      return minutes;
    }
  }
  
  return null;
}

function extractMealType(text) {
  for (const [mealType, keywords] of Object.entries(dietaryMappings.mealTypes)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return mealType;
      }
    }
  }
  return '';
}

function extractDuration(text) {
  const durationPatterns = [
    { pattern: /(\d+)\s*day/i, multiplier: 1 },
    { pattern: /(\d+)\s*week/i, multiplier: 7 },
    { pattern: /(\d+)\s*month/i, multiplier: 30 }
  ];
  
  for (const { pattern, multiplier } of durationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]) * multiplier;
    }
  }
  
  return null;
}

function extractLocation(text, userLocation = null) {
  // Check for location keywords
  const locationKeywords = ['near me', 'nearby', 'local', 'here', 'my area', 'around me', 'close by'];
  
  for (const keyword of locationKeywords) {
    if (text.includes(keyword)) {
      return userLocation || 'current_location';
    }
  }
  
  return null;
}

function extractAllergens(text, userAllergens = []) {
  const allergens = [];
  
  for (const [allergen, signals] of Object.entries(allergenSignals.allergenSignals)) {
    for (const signal of signals) {
      if (text.includes(signal)) {
        allergens.push(allergen);
        break;
      }
    }
  }
  
  // Add user's saved allergens
  return [...new Set([...allergens, ...userAllergens])];
}

function extractIngredients(text) {
  // Simple ingredient extraction - look for common patterns
  const ingredientPatterns = [
    /substitute\s+for\s+(\w+)/i,
    /replace\s+(\w+)/i,
    /instead\s+of\s+(\w+)/i,
    /alternative\s+to\s+(\w+)/i
  ];
  
  const ingredients = [];
  for (const pattern of ingredientPatterns) {
    const match = text.match(pattern);
    if (match) {
      ingredients.push(match[1].toLowerCase());
    }
  }
  
  return ingredients;
}