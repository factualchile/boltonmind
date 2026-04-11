import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Iniciamos cliente OpenAI
// Requiere la variable de entorno OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Leer el prompt base desde el archivo (simulando que esto puede ser inyectado por base de datos luego)
    const promptPath = path.join(process.cwd(), 'docs', 'agente-paciente', 'system-prompt.md');
    let systemPromptBase = '';
    
    try {
      systemPromptBase = fs.readFileSync(promptPath, 'utf8');
      
      // Simulamos la inyección de los datos del terapeuta (Idealmente esto viene de DB)
      systemPromptBase = systemPromptBase.replace(/\[Nombre del terapeuta\]/g, 'Dr. Roberto Vargas (Ejemplo)');
      systemPromptBase = systemPromptBase.replace(/\[Prompt añadido por el terapeuta\]/g, 'Prioriza la exploración somática, preguntas sutiles sobre cómo se siente su cuerpo cuando experimentan ciertas emociones.');
      
    } catch (err) {
      console.warn("No se pudo leer el archivo system-prompt.md. Usando fallback.");
      systemPromptBase = "Eres un asistente de paz mental.";
    }

    // Formatear historial para OpenAI
    const formattedHistory = (history || []).filter(msg => msg.role !== 'system').map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Hacer la llamada a OpenAI (GPT-4)
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPromptBase },
        ...formattedHistory,
        { role: 'user', content: message }
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
