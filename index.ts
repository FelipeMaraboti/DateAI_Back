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
  "Crie um roteiro de date tropical para um casal, em lugares como praia ou cachoeira. Foque em atividades simples, refrescantes e que gerem conexão emocional. Descreva passo a passo a experiência, incluindo pequenos detalhes que tornam o momento especial. Seja romântico, criativo, curto e direto. Respeite o máximo de 1 parágrafos, com 1 a 2 frases cada.",  // Prompt para algo TROPICAL
  "Crie um roteiro de date em um restaurante para um casal. Sugira como escolher o lugar, aproveitar a experiência juntos e pequenas surpresas que deixem o momento romântico e divertido. Seja detalhado, mas direto, com foco em conexão emocional. Respeite o máximo de 1 parágrafos, com 1 a 2 frases cada.",   // Prompt para algo RESTAURANTE
  "Crie um roteiro de date caseiro para um casal. Foque em atividades simples, como cozinhar juntos, assistir algo especial ou preparar um ambiente romântico. A ideia deve ser intimista, prática e cheia de carinho. Seja criativo, curto e direto. Respeite o máximo de 1 parágrafos, com 1 a 2 frases cada.",      // Prompt para algo CASEIRO
  "Crie um roteiro de date inspirado em uma viagem, sem mencionar destinos específicos. Descreva como planejar juntos, imaginar possibilidades e criar momentos românticos de aventura e descoberta. Seja detalhado, mas objetivo e fácil de seguir. Respeite o máximo de 1 parágrafos, com 1 a 2 frases cada.",         // Prompt para algo VIAGEM
  "Crie um roteiro de date com espírito de aventura para um casal. Inclua atividades como trilha, bicicleta ou passeios ao ar livre, que tragam emoção e cumplicidade. O foco é criar memórias divertidas e reforçar o companheirismo. Seja curto, direto, criativo e romântico. Respeite o máximo de 1 parágrafos, com 1 a 2 frases cada."    // Prompt para algo AVENTURA
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
    console.error(error);
    res.status(500).json({ error: "Erro ao chamar a IA" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
