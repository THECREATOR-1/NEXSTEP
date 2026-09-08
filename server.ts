import express from "express";
import path from "path";
import http from "http";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const httpServer = http.createServer(app);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai/analyze-career", async (req, res) => {
    try {
      const { profile } = req.body;
      const prompt = `Analyze this school student profile and recommend careers:\n${JSON.stringify(profile)}\n\nRespond with a JSON object exactly matching this schema:\n{\n  "matches": [\n    {\n      "career": "Career Name",\n      "matchScore": 85,\n      "academicFit": 80,\n      "interestFit": 90,\n      "aptitudeFit": 85,\n      "careerAlignment": 85,\n      "strengths": ["string"],\n      "gaps": ["string"],\n      "recommendations": ["string"]\n    }\n  ],\n  "recommendedStream": "Science",\n  "strengths": ["string"],\n  "gaps": ["string"],\n  "actions": ["string"]\n}\n\nDo not include markdown blocks, just the JSON.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      let text = response.text || "{}";
      text = text.replace(/```json\n?|\n?```/g, '');
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to analyze career" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
