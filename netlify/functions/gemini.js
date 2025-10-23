// netlify/functions/gemini.js
const { GoogleGenAI } = require('@google/genai');

// NOTE: L'initialisation est retirée d'ici pour la rendre "lazy" et plus sûre.
// const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 


// Handler de la fonction sans serveur
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Méthode non autorisée' };
    }

    try {
        // Initialisation de l'IA déplacée à l'intérieur du handler
        // CELA GARANTIT que process.env est chargé lors de l'exécution
        const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 
        
        const { prompt } = JSON.parse(event.body);

        // Appel à l'API Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Modèle performant et rapide
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: response.text.trim() }), // Ajout de trim() par sécurité
        };

    } catch (error) {
        // En cas d'erreur API, Netlify verra maintenant un 500 propre au lieu d'un 502 brut.
        console.error('Erreur API Gemini (Détail) :', error); 
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Erreur lors de l'appel à l'IA. Détail technique: ${error.message}` }),
        };
    }
};}
};
