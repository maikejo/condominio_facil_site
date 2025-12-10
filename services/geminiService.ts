import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateNoticeDraft = async (topic: string, tone: 'formal' | 'friendly' | 'urgent'): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini Service");
    return "Erro: Chave de API não configurada. Não foi possível gerar o texto.";
  }

  try {
    const prompt = `
      Você é um assistente de condomínio inteligente.
      Escreva um aviso para os moradores sobre o seguinte tópico: "${topic}".
      O tom deve ser: ${tone === 'formal' ? 'Formal e respeitoso' : tone === 'urgent' ? 'Urgente e direto' : 'Amigável e comunitário'}.
      O texto deve ser claro, conciso e bem formatado (máximo 2 parágrafos).
      Não inclua saudações genéricas como "Olá eu sou a IA", apenas o texto do aviso.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o aviso.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao tentar conectar com a Inteligência Artificial.";
  }
};

export const analyzeMaintenanceRequest = async (description: string): Promise<{ priority: 'low' | 'medium' | 'high', category: string }> => {
  if (!apiKey) return { priority: 'medium', category: 'Geral' };

  try {
    const prompt = `
      Analise a seguinte solicitação de manutenção de condomínio: "${description}".
      
      Retorne APENAS um objeto JSON (sem markdown) com duas propriedades:
      1. "priority": deve ser "low", "medium", ou "high" baseado na urgência (vazamentos, fogo, segurança são high).
      2. "category": uma palavra classificando o problema (ex: Elétrica, Hidráulica, Estrutura, Limpeza).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "{}";
    // Tenta limpar markdown se houver
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { priority: 'medium', category: 'Geral' };
  }
};