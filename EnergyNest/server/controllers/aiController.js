const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if(!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
             return res.json({ 
                reply: `[Simulated Response] You asked: "${message}". Please set a valid GEMINI_API_KEY in the .env file to enable real AI responses. I am the AI Energy Advisor.`
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const systemPrompt = `You are the AI Energy Advisor for EnergyNest, a peer-to-peer solar energy sharing platform in India. 
        Your goal is to help users optimize their solar usage, understand their earnings/savings, and explain how the P2P grid works.
        Keep your answers concise, friendly, and helpful. Current context: Average P2P selling rate is ₹8.50/kWh, grid buying rate is ₹8/kWh, grid selling rate is ₹3/kWh.`;

        const prompt = `${systemPrompt}\n\nUser: ${message}\nAI:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI Advisor. Check API Key." });
    }
};
