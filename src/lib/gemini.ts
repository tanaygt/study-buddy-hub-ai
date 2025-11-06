/**
 * Gemini AI Service
 * Handles all Gemini API interactions using Gemini 2.0 model
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
}

/**
 * Generate content using Gemini 2.0 Flash model
 */
export async function generateWithGemini(
  prompt: string,
  history: Array<{ isUser: boolean; content: string }> = [],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  try {
    // Convert history to Gemini format
    const contents: GeminiMessage[] = history.map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const requestBody: GeminiRequest = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 2000,
        topP: 0.95,
        topK: 40,
      },
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to generate content with Gemini');
  }
}

/**
 * Generate flashcards using Gemini AI
 */
export async function generateFlashcards(
  topic: string,
  count: number = 5
): Promise<Array<{ question: string; answer: string }>> {
  const prompt = `Generate ${count} educational flashcards about "${topic}". 
Format your response as a JSON array where each item has "question" and "answer" fields.
Make the questions clear and the answers comprehensive but concise.
Example format: [{"question": "What is X?", "answer": "X is..."}, ...]`;

  try {
    const response = await generateWithGemini(prompt, [], {
      temperature: 0.8,
      maxTokens: 2000,
    });

    // Try to parse JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const flashcards = JSON.parse(jsonMatch[0]);
      if (Array.isArray(flashcards) && flashcards.length > 0) {
        return flashcards.slice(0, count).map((card: any, index: number) => ({
          question: card.question || `Question ${index + 1}`,
          answer: card.answer || 'Answer not available',
        }));
      }
    }

    // Fallback: parse manually if JSON extraction fails
    const lines = response.split('\n').filter(line => line.trim());
    const flashcards: Array<{ question: string; answer: string }> = [];
    
    for (let i = 0; i < lines.length && flashcards.length < count; i += 2) {
      const question = lines[i].replace(/^\d+[\.\)]\s*/, '').replace(/^Q:\s*/i, '').trim();
      const answer = lines[i + 1]?.replace(/^A:\s*/i, '').trim() || 'Answer not available';
      
      if (question) {
        flashcards.push({ question, answer });
      }
    }

    // If we still don't have enough, create generic ones
    while (flashcards.length < count) {
      flashcards.push({
        question: `What is an important concept about ${topic}?`,
        answer: `This is a key concept related to ${topic} that you should study.`,
      });
    }

    return flashcards.slice(0, count);
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}

/**
 * Chat with Gemini (for Chat Tutor)
 */
export async function chatWithGemini(
  message: string,
  history: Array<{ isUser: boolean; content: string }> = []
): Promise<string> {
  const systemPrompt = `You are an AI study tutor. Help students learn by providing clear, educational explanations. 
Be friendly, encouraging, and focus on helping them understand concepts. 
If they ask something outside of academics, politely redirect them to study-related topics.`;

  const fullPrompt = `${systemPrompt}\n\nStudent: ${message}`;
  
  return generateWithGemini(fullPrompt, history, {
    temperature: 0.7,
    maxTokens: 1000,
  });
}

