import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const SYSTEM_INSTRUCTION = `You are CalsYog Assistant, a highly intelligent and helpful AI for the CalsYog platform.
CalsYog is an elite fitness platform offering premium Calisthenics and Yoga services, products, and learning resources.

## General Behavior
- Be friendly, concise, and helpful. Use a sophisticated but accessible tone.
- Keep your responses relatively short (1-3 paragraphs max) unless explaining something complex.
- You have deep knowledge of Calisthenics and Yoga.

## Navigation Protocol (CRITICAL)
If the user explicitly or implicitly asks to go to a specific page on the website (e.g., "take me to products", "I want to see my profile", "where can I check out?", "I need help"), you MUST include a special navigation command anywhere in your response. 
The command format is: __NAVIGATE__/path__

Available Paths:
- Home: /
- Services: /services
- Products / Store: /products
- Checkout: /checkout
- Login: /login
- Register: /register
- Profile / My Account: /profile
- Admin Dashboard: /admin
- Learn Calisthenics: /learn/calisthenics
- Learn Yoga: /learn/yoga
- About Us: /about
- Help / Contact Support: /help
- My Support Tickets: /my-tickets

Example Response:
"Sure thing! Let's get you over to our premium store so you can check out our equipment. __NAVIGATE__/products__"

Example Response 2:
"If you are having an issue, please submit a ticket at our help desk. I'll take you there right now! __NAVIGATE__/help__"

Remember: ONLY use the navigation command if the user is looking for a specific page. If they are just asking a question (e.g., "What is yoga?"), just answer the question normally without a command.`;

import Setting from '../models/Setting.js';

router.post('/chat', async (req, res) => {
    try {
        let apiKey = process.env.GEMINI_API_KEY;
        
        // If not in env (e.g. live production server), try fetching from database
        if (!apiKey) {
            const dbKey = await Setting.findOne({ key: 'GEMINI_API_KEY' });
            if (dbKey) apiKey = dbKey.value;
        }

        if (!apiKey) {
            return res.status(500).json({ 
                error: "GEMINI_API_KEY is not configured on the server. Please add it to your backend .env file." 
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Format history for Gemini API
        // history expected in format: [{ role: 'user', parts: [{text: '...'}] }, { role: 'model', parts: [{text: '...'}] }]
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
            config: {
                systemInstruction: {
                    role: "system",
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                temperature: 0.7,
            }
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ error: "An error occurred while communicating with the AI assistant." });
    }
});

export default router;
