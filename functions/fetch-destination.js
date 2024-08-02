// netlify/functions/fetch-destination.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { departure, numPeople, vacationType, budget } = JSON.parse(event.body);

    const prompt = `I want to go on a ${vacationType} vacation with a budget of $${budget} for ${numPeople} people. Where should I go?`;

    const apiKey = process.env.OPENAI_API_KEY; // Get the API key from environment variables

    try {
        const aiResponse = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ 
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 150
            })
        });
        const aiData = await aiResponse.json();
        const destination = aiData.choices[0].text.trim();

        return {
            statusCode: 200,
            body: JSON.stringify({ destination })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch destination' })
        };
    }
};
