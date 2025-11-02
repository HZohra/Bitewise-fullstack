// Main chatbot processing module that integrates intent detection, entity extraction, action execution, and response formatting.

//4 main steps(pipelines):
//1. Detect user intent from message (Calls detectIntent(text))
//2. Extract entities from message  (Calls extractEntities(text, profile))
//3. Execute action based on intent and entities (Calls executeAction(intent, entities, profile))
//4. Format response to send back to user  (Calls formatResponse(intent, actionResult, entities))


import { detectIntent } from './intent-detector.js';
import { extractEntities } from './entity-extractor.js';
import { executeAction } from './action-handlers.js';
import { formatResponse } from './response-formatter.js';

export async function processChatMessage({ user_id, text, profile }) {
  try {
    // Step 1: Detect user intent
    const intent = detectIntent(text);
    
    // Step 2: Extract entities from the message
    const entities = extractEntities(text, profile);
    
    // Step 3: Execute the appropriate action based on intent
    const actionResult = await executeAction(intent, entities, profile);
    
    // Step 4: Format the response
    const response = formatResponse(intent, actionResult, entities);
    
    return {
      intent,
      entities,
      response,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      intent: 'error',
      entities: {},
      response: "I'm sorry, I encountered an error processing your request. Please try again.",
      timestamp: new Date().toISOString()
    };
  }
}