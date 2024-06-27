// Import necessary modules
import OpenAI from 'openai-api';
import Amadeus from 'amadeus';

// Import config file for API keys
import config from './config';

// Initialize OpenAI API client
const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

// Initialize Amadeus API client
const amadeus = new Amadeus({
    clientId: config.amadeus.clientId,
    clientSecret: config.amadeus.clientSecret,
});

// Function to generate text using OpenAI
async function generateText(prompt) {
    try {
        const result = await openai.complete({
            engine: 'davinci',
            prompt: prompt,
            maxTokens: 150,
            stop: ['\n'],
        });
        return result.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating text from OpenAI:', error);
        return 'Oops! Something went wrong on our end.';
    }
}

// Function to search for flights using Amadeus
async function searchFlights(destination) {
    try {
        const response = await amadeus.shopping.flightOffers.get({
            originLocationCode: 'SFO', // Replace with your origin location code
            destinationLocationCode: destination,
            departureDate: '2024-07-01', // Replace with desired departure date
            adults: 1, // Number of adults
        });
        return response.data;
    } catch (error) {
        console.error('Error searching flights with Amadeus:', error);
        return 'Oops! Something went wrong while searching for flights.';
    }
}

// Function to send message and handle responses
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    if (userInput.value.trim() === '') {
        return;
    }

    // Clear user input immediately
    const message = userInput.value;
    userInput.value = '';

    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${message}`; // Include "You:" before user message
    userMessage.classList.add('message', 'user');
    chatMessages.appendChild(userMessage);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'ai');
    typingIndicator.innerHTML = '<div class="typing-indicator"></div><div class="typing-indicator"></div><div class="typing-indicator"></div>';
    chatMessages.appendChild(typingIndicator);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Send user message to AI and get response
    const aiResponse = await generateText(message);

    // Remove typing indicator
    chatMessages.removeChild(typingIndicator);

    // Add AI response to chat
    const aiMessage = document.createElement('div');
    aiMessage.textContent = `AI: ${aiResponse}`; // Include "AI:" before AI response
    aiMessage.classList.add('message', 'ai');
    chatMessages.appendChild(aiMessage);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // If AI response contains a suggestion for a destination
    if (aiResponse.includes('suggest a destination')) {
        const destination = aiResponse.split('suggest a destination')[1].trim();
        const flightOffers = await searchFlights(destination);
        // Display flight offers or handle as needed
        console.log('Flight offers:', flightOffers);
    }
}

// Handle Enter key press to send message
const userInput = document.getElementById('user-input');
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
