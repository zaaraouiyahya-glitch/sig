// netlify/functions/gemini.js
const { GoogleGenAI } = require('@google/genai');

// NOTE: On retire l'initialisation ici, car c'est là que l'erreur se produit.
// const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 

// Handler de la fonction sans serveur
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Méthode non autorisée' };
    }

    try {
        // Initialisation déplacée ICI, à l'intérieur du gestionnaire, 
        // juste avant son utilisation (plus sûr).
        const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 
        
        const { prompt } = JSON.parse(event.body);

        // Appel à l'API Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        // ... (le reste du retour 200) ...

    } catch (error) {
        // ... (le reste de la gestion d'erreur 500) ...
        // Le log devrait maintenant afficher des erreurs plus utiles si la clé est invalide.
    }
};