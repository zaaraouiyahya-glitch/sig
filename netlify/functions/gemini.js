// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Fonction principale
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    // Initialisation de l'API Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // ou 'gemini-2.0-flash' si dispo

    // Lecture du prompt envoyé depuis le frontend
    const { prompt } = JSON.parse(event.body);

    // Appel à l'API Gemini
    const result = await model.generateContent(prompt);

    // Récupération du texte de réponse
    const text = result.response.text();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    };

  } catch (error) {
    console.error('Erreur API Gemini (Détail) :', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: `Erreur lors de l'appel à l'IA : ${error.message}`,
      }),
    };
  }
};
