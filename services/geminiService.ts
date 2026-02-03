
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const COOLDOWN_MS = 30000; // 30 second cooldown to prevent spam
const MAX_RETRIES = 2;

// Simple wait utility for retries
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getMotivationalCheer = async (taskCount: number) => {
  // 1. Check Cooldown (Rate Limiting Safeguard)
  const lastCall = localStorage.getItem('pomodoro-last-cheer-ts');
  const now = Date.now();
  
  if (lastCall && (now - parseInt(lastCall)) < COOLDOWN_MS) {
    console.log("Cheer request ignored: Cooldown active.");
    return taskCount === 0 ? "You're all caught up! Enjoy the peace." : "Keep up the great momentum! 💖";
  }

  const performRequest = async (retryCount = 0): Promise<string> => {
    try {
      const isZeroTasks = taskCount === 0;
      const emojiInstruction = isZeroTasks 
        ? "Do NOT use any emojis at the end of the sentence." 
        : "Use cute emojis like ✨, 💖, or 🍓 at the end.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me a very short, cute, and encouraging motivational message (under 12 words) for someone using a Pomodoro timer. They have ${taskCount} tasks left. ${emojiInstruction}`,
        config: {
          temperature: 0.9,
        }
      });
      
      let text = response.text || "You're doing amazing! Keep going! ✨";
      
      if (isZeroTasks) {
        text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]+$/gu, '').trim();
      }

      // Update timestamp only on successful call
      localStorage.setItem('pomodoro-last-cheer-ts', Date.now().toString());
      return text;

    } catch (error: any) {
      // 2. Handle Rate Limiting (429) specifically
      if (error?.status === 429) {
        console.error("Rate limit hit (429).");
        return "Taking a tiny breather... check back in a bit! ✨";
      }

      // 3. Retry Logic for transient errors (5xx)
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        await wait(delay);
        return performRequest(retryCount + 1);
      }

      console.error("Error fetching cheer after retries:", error);
      return taskCount === 0 ? "Rest well, you've earned it." : "You've got this, superstar! 💖";
    }
  };

  return performRequest();
};

export const getCooldownRemaining = () => {
  const lastCall = localStorage.getItem('pomodoro-last-cheer-ts');
  if (!lastCall) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - parseInt(lastCall));
  return Math.max(0, remaining);
};
