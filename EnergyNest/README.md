# EnergyNest: AI-Powered P2P Solar Energy Sharing 🌱

EnergyNest is a decentralized platform that connects households with rooftop solar panels to share surplus clean energy with their neighbors. It aims to reduce energy waste, provide fair pricing for peer-to-peer trading, and optimize the local grid using AI.

## 🌟 Key Features

- **Real-time Dashboard:** Live tracking of solar generation, consumption, sharing stats, and earnings.
- **Neighborhood Energy Map:** Visual live map showing energy flowing between houses, avoiding transmission losses.
- **P2P Energy Trading:** Automated system to buy and sell surplus solar energy.
- **AI Energy Advisor:** An AI-powered assistant that helps users optimize their energy strategy and forecasts.
- **Forecasting:** 48-hour AI-driven solar generation forecasting.

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- **Chart.js** for interactive data visualization
- **Lucide Icons** for clean, modern iconography
- **Google Fonts** (Outfit, Inter) for typography

**Backend:**
- **Node.js** & **Express.js** for REST API and server logic
- **@google/generative-ai** for the AI Advisor capabilities
- **Helmet.js** for security headers
- **Express-rate-limit** for API rate limiting

## 📜 Credits & References

This project leverages the following incredible open-source tools, services, and assets:

- **[Google Gemini AI](https://deepmind.google/technologies/gemini/):** Powers the *AI Energy Advisor*, providing real-time, intelligent energy strategies and natural language conversations.
- **[Chart.js](https://www.chartjs.org/):** Used for rendering beautiful, interactive charts like the 48-hour solar forecast.
- **[Lucide Icons](https://lucide.dev/):** A beautiful, consistent open-source icon set used throughout the UI.
- **[Google Fonts](https://fonts.google.com/):** Specifically the *Outfit* and *Inter* font families, which provide the modern, clean typography of the dashboard.
- **[Express.js](https://expressjs.com/):** The fast, unopinionated, minimalist web framework for Node.js powering the backend API.
- **[Vercel](https://vercel.com/):** The deployment platform used to host and serve the EnergyNest application globally.

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Google Gemini API Key (for the AI features to work).

### Installation
1. Clone the repository.
2. Navigate to the project directory: `cd EnergyNest`
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your API credentials:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Start the server locally:
   ```bash
   node server/server.js
   ```
6. Open your browser and navigate to `http://localhost:3000`.

## 📄 License
This project is licensed under the ISC License.
