// app.js

import config from './config.js';

const OPENAI_API_KEY = config.openai_api_key;
const AMADEUS_API_KEY = config.amadeus_api_key;

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const flightPopup = document.getElementById('flight-popup');
const closePopup = document.getElementById('close-popup');
const flightOptions = document.getElementById('flight-options');

sendButton.addEventListener('click', () => {
    const message = userInput.value;
    if (message.trim() !== '') {
        addMessageToChat('user', message);
        getBotResponse(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

closePopup.addEventListener('click', () => {
    flightPopup.style.display = 'none';
});

function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(`${sender}-message`);
    messageElement.innerText = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function getBotResponse(message) {
    addMessageToChat('bot', 'Thinking...');
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: message,
            max_tokens: 150
        })
    });

    const data = await response.json();
    const botMessage = data.choices[0].text.trim();
    addMessageToChat('bot', botMessage);

    // After the bot provides a suggestion, fetch flight options
    if (botMessage.toLowerCase().includes('suggesting')) {
        fetchFlightOptions(botMessage);
    }
}

async function fetchFlightOptions(city) {
    // Simulating API call to Amadeus for flight options
    addMessageToChat('bot', 'Fetching flight options...');
    
    const response = await fetch('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AMADEUS_API_KEY}`
        }
    });

    const data = await response.json();
    displayFlightOptions(data.data);
}

function displayFlightOptions(flights) {
    flightOptions.innerHTML = '';
    flights.forEach(flight => {
        const option = document.createElement('div');
        option.innerText = `Flight to ${flight.destination} - ${flight.price.total} USD`;
        flightOptions.appendChild(option);
    });
    flightPopup.style.display = 'flex';
}
