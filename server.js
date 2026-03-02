import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-quiz", async (req, res) => {
  const { topic } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional quiz generator. Create 10 multiple-choice questions with 4 options each and clearly mark the correct answer."
        },
        {
          role: "user",
          content: `Generate a professional quiz about ${topic}`
        }
      ],
      temperature: 0.7
    });

    res.json({ quiz: completion.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "Error generating quiz" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
