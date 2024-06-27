import { OpenAI } from 'openai'; // Assuming this is how you import OpenAI module
import { openAIKey, amadeusAPIKey } from './config.js'; // Importing OpenAI and Amadeus API keys from config.js

const openai = new OpenAI({ apiKey: openAIKey });

async function generateText(prompt) {
    const response = await openai.completions.create({
        engine: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150
    });

    return response.data.choices[0].text.trim();
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    if (userInput.value.trim() === '') {
        return;
    }

    const message = userInput.value;
    userInput.value = '';

    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${message}`;
    userMessage.classList.add('message', 'user');
    chatMessages.appendChild(userMessage);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'ai');
    typingIndicator.innerHTML = '<div class="typing-indicator"></div><div class="typing-indicator"></div><div class="typing-indicator"></div>';
    chatMessages.appendChild(typingIndicator);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const aiResponse = await generateText(message);

        chatMessages.removeChild(typingIndicator);

        const aiMessage = document.createElement('div');
        aiMessage.textContent = `AI: ${aiResponse}`;
        aiMessage.classList.add('message', 'ai');
        chatMessages.appendChild(aiMessage);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Example of Amadeus API call (replace with your actual usage)
        const amadeusResponse = await fetch(`https://example.com/amadeus-api-endpoint`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${amadeusAPIKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const amadeusData = await amadeusResponse.json();
        console.log('Amadeus API Response:', amadeusData);
    } catch (error) {
        console.error('Error fetching AI response:', error);
    }
}

const userInput = document.getElementById('user-input');
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const sendButton = document.querySelector('button');
sendButton.addEventListener('click', sendMessage);
