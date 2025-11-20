// Simple test script for the chatbot
import { processChatMessage } from './src/modules/chatbot/chatbot/index.js';

async function testChatbot() {
  console.log('🤖 Testing BiteWise Chatbot...\n');

  const testCases = [
    "Show me vegan dinner under 30 min",
    "Plan my meals for 2 days",
    "Why can't I eat this dish?",
    "Substitute for milk",
    "Find gluten-free pasta recipes"
  ];

  for (const testCase of testCases) {
    console.log(`👤 User: ${testCase}`);
    try {
      const result = await processChatMessage({
        user_id: 'test_user',
        text: testCase,
        profile: {
          diets: ['vegan'],
          allergens: ['dairy'],
          max_time: 30,
          location: null
        }
      });
      
      console.log(`🤖 Bot: ${result.response}`);
      console.log(`   Intent: ${result.intent}`);
      console.log(`   Entities: ${JSON.stringify(result.entities, null, 2)}`);
      console.log('---\n');
    } catch (error) {
      console.error(`❌ Error testing "${testCase}":`, error.message);
      console.log('---\n');
    }
  }
}

testChatbot().catch(console.error);
