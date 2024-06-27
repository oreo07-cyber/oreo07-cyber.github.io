import CONFIG from './config.js';

const chatBox = document.getElementById('chat-box');
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const bookingPopup = document.getElementById('booking-popup');
const flightOptions = document.getElementById('flight-options');
const closeButton = document.querySelector('.close-button');
const bookButton = document.getElementById('book-button');

const chatHistoryData = [];

function updateChatBox() {
    chatHistory.innerHTML = '';
    chatHistoryData.forEach(item => {
        const messageElement = document.createElement('div');
        messageElement.classList.add(item.sender === 'bot' ? 'bot-message' : 'user-message');
        messageElement.textContent = item.message;
        chatHistory.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() === '') return;
    chatHistoryData.push({ sender: 'user', message: userMessage });
    updateChatBox();
    userInput.value = '';

    if (chatHistoryData.length === 1) {
        const botResponse = 'How many people are going on vacation?';
        chatHistoryData.push({ sender: 'bot', message: botResponse });
        updateChatBox();
    } else if (chatHistoryData.length === 3) {
        const botResponse = 'Any pets?';
        chatHistoryData.push({ sender: 'bot', message: botResponse });
        updateChatBox();
    } else if (chatHistoryData.length === 5) {
        const botResponse = 'What\'s the occasion?';
        chatHistoryData.push({ sender: 'bot', message: botResponse });
        updateChatBox();
    } else if (chatHistoryData.length === 7) {
        const userPreferences = {
            people: chatHistoryData[1].message,
            pets: chatHistoryData[3].message,
            occasion: chatHistoryData[5].message
        };
        suggestCity(userPreferences);
    }
});

async function suggestCity(userPreferences) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: `Based on these preferences, suggest a vacation city: ${JSON.stringify(userPreferences)}`,
            max_tokens: 50
        })
    });
    const data = await response.json();
    const city = data.choices[0].text.trim();
    const botResponse = `Based on your preferences, we suggest visiting ${city}!`;
    chatHistoryData.push({ sender: 'bot', message: botResponse });
    updateChatBox();
    fetchFlights(city);
}

async function fetchFlights(city) {
    try {
        const response = await fetch(`https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=MAD&destination=${city}&apikey=${CONFIG.AMADEUS_API_KEY}`);
        const data = await response.json();

        data.data.forEach(flight => {
            const flightDetails = `Flight to ${flight.destination}: $${flight.price.total}`;
            chatHistoryData.push({ sender: 'bot', message: flightDetails });
        });
        updateChatBox();
        showBookingPopup(data.data); // Show booking popup with flight details
    } catch (error) {
        console.error("Error fetching flights:", error);
    }
}

function showBookingPopup(flights) {
    flightOptions.innerHTML = '';
    flights.forEach(flight => {
        const option = document.createElement('div');
        option.textContent = `Flight to ${flight.destination}: $${flight.price.total}`;
        flightOptions.appendChild(option);
    });
    bookingPopup.style.display = 'block';
}

closeButton.addEventListener('click', () => {
    bookingPopup.style.display = 'none';
});

bookButton.addEventListener('click', () => {
    alert('Booking confirmed!');
    bookingPopup.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target === bookingPopup) {
        bookingPopup.style.display = 'none';
    }
};
