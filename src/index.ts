import 'dotenv/config'; // carrega variáveis do .env
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompts: string[] = [
  "Crie um roteiro de date tropical para um casal, com foco em praia ou cachoeira. O roteiro deve incluir atividades simples e refrescantes que gerem conexão emocional. Descreva passo a passo a experiência com pequenos detalhes, sendo romântico, criativo e direto. O texto deve ter exatamente um parágrafo, com duas frases.",  // Prompt para algo TROPICAL
  "Crie um roteiro de date em um restaurante para um casal. Sugira a escolha do lugar, como aproveitar a experiência juntos e pequenas surpresas que tornem o momento romântico e divertido. O foco é na conexão emocional. O texto deve ser detalhado, mas direto, com exatamente um parágrafo e duas frases.",   // Prompt para algo RESTAURANTE
  "Crie um roteiro de date caseiro para um casal, focado em atividades simples como cozinhar juntos ou assistir a algo especial. A ideia deve ser intimista, prática e cheia de carinho. O texto deve ser criativo, direto e romântico, com exatamente um parágrafo e duas frases.",      // Prompt para algo CASEIRO
  "Crie um roteiro de date inspirado em uma viagem, sem mencionar destinos específicos. Descreva como planejar juntos, imaginar possibilidades e criar momentos de aventura e descoberta. O texto deve ser detalhado, direto e fácil de seguir, com exatamente um parágrafo e duas frases.",         // Prompt para algo VIAGEM
  "Crie um roteiro de date com espírito de aventura para um casal. Inclua atividades como trilha ou passeios ao ar livre que gerem emoção e cumplicidade. O objetivo é criar memórias divertidas e reforçar o companheirismo, em um texto curto, direto, criativo e romântico, com exatamente um parágrafo e duas frases."    // Prompt para algo AVENTURA
];

app.post("/ask", async (req: Request, res: Response) => {
  try {
    const { choice } = req.body;

    if (!choice || choice < 1 || choice > prompts.length) {
      return res.status(400).json({ error: "Escolha inválida" });
    }

    const prompt = prompts[choice - 1] as string;

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 550, // força respostas curtas
      },
    });

    res.json({ answer: response.response.text() });

  } catch (error) {
    res.status(500).json({ error: "Erro ao chamar a IA" });
  }
});

app.listen(process.env.PORT || 3000);
