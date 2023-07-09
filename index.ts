// question-answering-server/index.ts
import express, { Request, Response } from 'express';
import { OpenAIApi } from 'openai';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});

const openaiApiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your API key
const openaiClient = new OpenAIApi(openaiApiKey);

app.post('/answer', async (req: Request, res: Response) => {
  const { question } = req.body;

  try {
    const response = await openaiClient.completions.create({
      engine: 'davinci',
      prompt: question,
      maxTokens: 100,
    });

    const answer = response.choices[0].text.trim();
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
