import express from 'express';
import { spawn } from 'child_process';
import { verifyToken } from './middleware/auth';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(apiLimiter);

app.post('/api/generate-content', verifyToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const generatedContent = await generateContentWithOllama(prompt);
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'An error occurred while generating content' });
  }
});

async function generateContentWithOllama(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama2', prompt]);
    let output = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      console.error(`Ollama error: ${data}`);
    });

    ollama.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Ollama process exited with code ${code}`));
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});