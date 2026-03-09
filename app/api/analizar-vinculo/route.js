import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        const { tipo, contenido, intencion } = await req.json();

        let userPrompt = `Analiza el siguiente contenido de una relación personal.
    Tipo de contenido: ${tipo}
    Intención del usuario: ${intencion}
    Contenido: ${contenido}
    
    Por favor, genera un informe en formato JSON con la siguiente estructura:
    {
      "resumen": "string (un resumen de lo que detectaste)",
      "emociones": {
        "tension": number (0-100),
        "empatia": number (0-100),
        "reciprocidad": number (0-100)
      },
      "tono": "string (descripción del tono emocional)",
      "compatibilidad": "string (evaluación de la compatibilidad detectada)",
      "sugerencias": ["string (lista de 3 sugerencias)"],
      "terapiaPareja": boolean (true si sugieres terapia de pareja)
    }
    
    Responde ÚNICAMENTE con el objeto JSON.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Eres un experto en psicología y dinámica de relaciones de Bolton Mind. Analizas comunicaciones para ayudar a las personas a comprender mejor sus vínculos." },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const report = JSON.parse(response.choices[0].message.content);

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error en API OpenAI:', error);
        return NextResponse.json({ error: 'Fallo al procesar la información' }, { status: 500 });
    }
}
