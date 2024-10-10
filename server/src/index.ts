import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { auth, db } from './firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';
import axios from 'axios';
import cheerio from 'cheerio';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'FevDTL8ljX3Y9UHaLxna9OLCVOmBG8R4';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Implement rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(apiLimiter);

interface CustomRequest extends express.Request {
  user?: DecodedIdToken;
}

const verifyToken = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

const generateWithMistral = async (prompt: string) => {
  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content with Mistral:', error);
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }
};

const generateFramework = (content: string, platform: string) => {
  const frameworks = [
    'AIDA', 'PAS', 'FAB', 'Storytelling', 'Hub & Spoke', '4 Ps', 'Inverted Pyramid',
    'Skyscraper', 'Content Pillars', 'Hero\'s Journey', 'IDEA', 'Content Honeycomb',
    'Problem-Solution-Benefit', 'GARRTT'
  ];
  
  const selectedFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
  
  let framework = `Content Framework for ${platform} using ${selectedFramework}:\n\n`;
  
  switch (selectedFramework) {
    case 'AIDA':
      framework += `
1. Attention: [Grab the audience's attention with a compelling headline or visual]
2. Interest: [Build interest by presenting relevant information or benefits]
3. Desire: [Create a desire by showing how the content can solve a problem or fulfill a need]
4. Action: [Conclude with a strong call-to-action (CTA)]
      `;
      break;
    case 'PAS':
      framework += `
1. Problem: [Identify the problem your audience is facing]
2. Agitate: [Amplify the problem to highlight its significance]
3. Solution: [Present your product or content as the solution]
      `;
      break;
    // ... Add cases for other frameworks
    default:
      framework += `
1. Introduction: [Introduce the main topic]
2. Main Points: [List 2-3 key points]
3. Elaboration: [Provide more details on each point]
4. Conclusion: [Summarize and provide a call-to-action]
      `;
  }
  
  framework += `\nContent: ${content}\n`;
  framework += `\nPlatform-specific tips for ${platform}:\n`;
  framework += `[Add platform-specific tips here]`;
  
  return framework;
};

app.post('/api/select-framework', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { prompt, platform } = req.body;
    const frameworkSelectionPrompt = `Given the following content idea for ${platform}: "${prompt}", select the most appropriate content framework from the following options:
    1. AIDA (Attention, Interest, Desire, Action)
    2. PAS (Problem, Agitate, Solution)
    3. FAB (Features, Advantages, Benefits)
    4. Storytelling
    5. 4 Ps (Problem, Promise, Proof, Proposal)
    6. IDEA (Introduce, Discuss, Engage, Action)

    Respond with only the name of the selected framework.`;

    const selectedFramework = await generateWithMistral(frameworkSelectionPrompt);
    console.log('Selected framework:', selectedFramework);
    res.json({ selectedFramework: selectedFramework.trim() });
  } catch (error) {
    console.error('Error selecting framework:', error);
    res.status(500).json({ error: 'Failed to select framework' });
  }
});

app.post('/api/generate-content', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { prompt, platform, tone, length, selectedFramework } = req.body;
    console.log('Received content generation request:', { prompt, platform, tone, length, selectedFramework });
    
    const fullPrompt = `Generate a ${length} ${tone} social media post for ${platform} about: ${prompt}. Use the ${selectedFramework} framework to structure the content.`;
    console.log('Full prompt:', fullPrompt);
    
    const generatedContent = await generateWithMistral(fullPrompt);
    console.log('Generated content:', generatedContent);
    
    res.status(200).json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(error.message.includes('Rate limit exceeded') ? 429 : 500).json({ error: error.message });
  }
});

app.post('/api/generate-framework', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { content, platform } = req.body;
    console.log('Generating framework for:', { content, platform });

    const framework = generateFramework(content, platform);

    console.log('Generated framework:', framework);
    res.json({ framework });
  } catch (error) {
    console.error('Error generating framework:', error);
    res.status(500).json({ error: 'Failed to generate framework' });
  }
});

app.post('/api/generate-keywords', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { content } = req.body;
    console.log('Generating keywords for:', content);

    // Use web scraping to get keyword ideas
    const searchQuery = encodeURIComponent(`${content} related keywords`);
    const response = await axios.get(`https://www.google.com/search?q=${searchQuery}`);
    const $ = cheerio.load(response.data);

    const keywords = $('.s .st')
      .map((_, el) => {
        const text = $(el).text();
        const keyword = text.split(' ')[0]; // Get the first word as a keyword
        return { keyword, score: Math.random().toFixed(2) }; // Random score for demonstration
      })
      .get()
      .slice(0, 10);

    console.log('Generated keywords:', keywords);
    res.json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Failed to generate keywords' });
  }
});

app.post('/api/get-recommendations', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { userContent, userInterests } = req.body;
    
    // Use web scraping to get content recommendations
    const searchQuery = encodeURIComponent(`${userInterests.join(' ')} ${userContent} content ideas`);
    const response = await axios.get(`https://www.google.com/search?q=${searchQuery}`);
    const $ = cheerio.load(response.data);

    const recommendations = $('.g .r')
      .map((_, el) => {
        const topic = $(el).text();
        return {
          topic,
          type: Math.random() > 0.5 ? 'trend' : 'interest',
          relevance: Math.random().toFixed(2)
        };
      })
      .get()
      .slice(0, 5);

    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

app.post('/api/save-content', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { uid } = req.user!;
    const { content, platform } = req.body;

    await db.collection('generated_content').add({
      userId: uid,
      content,
      platform,
      createdAt: new Date(),
    });

    res.status(200).json({ message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});