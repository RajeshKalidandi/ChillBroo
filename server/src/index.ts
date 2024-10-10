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


const generateWithMistral = async (prompt: string): Promise<string> => {
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
    throw new Error('Failed to generate content with Mistral');
  }
};

interface ContentFramework {
  name: string;
  description: string;
  structure: string;
  usage: string;
  useCase: string;
}

const contentFrameworks: ContentFramework[] = [
  {
    name: "AIDA",
    description: "Attention, Interest, Desire, Action framework for persuasive content.",
    structure: `
1. Attention: [Grab the audience's attention with a compelling headline or visual]
2. Interest: [Build interest by presenting relevant information or benefits]
3. Desire: [Create a desire by showing how the content can solve a problem or fulfill a need]
4. Action: [Conclude with a strong call-to-action (CTA)]
    `,
    usage: "Effective for creating persuasive and sales-oriented content.",
    useCase: "Product launch announcements, promotional posts, event invitations"
  },
  {
    name: "PAS",
    description: "Problem, Agitate, Solution framework for addressing pain points.",
    structure: `
1. Problem: [Identify the problem your audience is facing]
2. Agitate: [Amplify the problem to highlight its significance]
3. Solution: [Present your product or content as the solution]
    `,
    usage: "Ideal for content that aims to convert, such as landing pages or product descriptions.",
    useCase: "Introducing a new feature, addressing common customer issues, showcasing case studies"
  },
  {
    name: "Storytelling",
    description: "Narrative framework to engage readers and build connections.",
    structure: `
1. Hook: [Begin with a hook that captures the audience's attention]
2. Conflict: [Describe a problem or conflict the main character faces]
3. Resolution: [Show how the problem is resolved, offering lessons or insights]
    `,
    usage: "Ideal for blog posts, social media content, and video scripts.",
    useCase: "Brand stories, customer testimonials, behind-the-scenes content"
  },
  // ... (add more frameworks as needed)
];


const generateFramework = (content: string, platform: string): ContentFramework => {
  // Select a random framework or implement logic to choose the most appropriate one
  const selectedFramework = contentFrameworks[Math.floor(Math.random() * contentFrameworks.length)];
  
  return {
    ...selectedFramework,
    structure: selectedFramework.structure + `\n\nContent: ${content}\n\nPlatform-specific tips for ${platform}:\n[Add platform-specific tips here]`
  };
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
    const { prompt, platform, tone, length, selectedFramework, targetAudience, callToAction, keywords } = req.body;
    console.log('Received content generation request:', { prompt, platform, tone, length, selectedFramework, targetAudience, callToAction, keywords });
    
    const fullPrompt = `
      Generate a ${length} ${tone} social media post for ${platform} about: ${prompt}
      Use the ${selectedFramework} framework to structure the content.
      Target audience: ${targetAudience}
      Call to action: ${callToAction}
      Include the following keywords: ${keywords.join(', ')}
    `;
    console.log('Full prompt:', fullPrompt);
    
    const generatedContent = await generateWithMistral(fullPrompt);
    console.log('Generated content:', generatedContent);
    
    res.status(200).json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof Error) {
      res.status(error.message.includes('Rate limit exceeded') ? 429 : 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
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

// Template CRUD operations
app.get('/api/templates', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    console.log('Fetching templates for user:', req.user?.uid);
    const { uid } = req.user!;
    const templatesSnapshot = await db.collection('templates').where('userId', '==', uid).get();
    console.log('Templates snapshot:', templatesSnapshot);
    const templates = templatesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Sending templates:', templates);
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

app.post('/api/templates', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { uid } = req.user!;
    const { name, content, platform } = req.body;
    const newTemplate = {
      userId: uid,
      name,
      content,
      platform,
      createdAt: new Date()
    };
    const docRef = await db.collection('templates').add(newTemplate);
    res.status(201).json({ id: docRef.id, ...newTemplate });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

app.delete('/api/templates/:id', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { uid } = req.user!;
    const { id } = req.params;
    const templateRef = db.collection('templates').doc(id);
    const doc = await templateRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Template not found' });
    }
    if (doc.data()?.userId !== uid) {
      return res.status(403).json({ error: 'Not authorized to delete this template' });
    }
    await templateRef.delete();
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

app.get('/api/content-frameworks', verifyToken, (req: CustomRequest, res: express.Response) => {
  res.json({ frameworks: contentFrameworks });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});