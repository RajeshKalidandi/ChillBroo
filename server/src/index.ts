import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { auth, db } from './firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';
import axios from 'axios';
import natural from 'natural';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Define a custom interface for the request object
interface CustomRequest extends express.Request {
  user?: DecodedIdToken;
}

// Middleware to verify Firebase ID token
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
    res.status(403).json({ error: 'Invalid token' });
  }
};

// API endpoint to store user profile data
app.post('/api/user-profile', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { uid } = req.user!;
    const profileData = req.body;

    await db.collection('user_profiles').doc(uid).set(profileData, { merge: true });

    res.status(200).json({ message: 'Profile data stored successfully' });
  } catch (error) {
    console.error('Error storing profile data:', error);
    res.status(500).json({ error: 'Failed to store profile data' });
  }
});

// New API endpoint to generate content
app.post('/api/generate-content', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { prompt, platform, tone, length } = req.body;
    
    const url = 'https://api.hyperbolic.xyz/v1/chat/completions';
    const hyperbolicResponse = await axios.post(url, {
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages: [
        {
          role: 'system',
          content: `You are a social media content creator. Generate a ${length} ${tone} post for ${platform} based on the following prompt:`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HYPERBOLIC_API_KEY}`
      }
    });

    const generatedContent = hyperbolicResponse.data.choices[0].message.content;

    res.status(200).json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// New API endpoint to save content
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

// New endpoint for generating framework
app.post('/api/generate-framework', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { content, platform } = req.body;
    
    const tokenizer = new natural.WordTokenizer();
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    tfidf.addDocument(content);
    const topics = tfidf.listTerms(0).slice(0, 5).map(item => item.term);

    const framework = `
1. Introduction
   - Hook: ${topics[0] || 'Introduce the main topic'}
   - Context: Why ${topics[0] || 'this topic'} matters for ${platform} audience

2. Main Points
   ${topics.slice(1, 4).map((topic, index) => `   ${index + 1}. Discuss ${topic}`).join('\n')}

3. Elaboration
   - Provide examples or case studies related to ${topics[0]}
   - Address potential questions or concerns

4. Call to Action
   - Encourage engagement with ${topics[0]}
   - Prompt for shares/likes

5. Hashtags
   #${topics[0].replace(/\s+/g, '')} #${platform}Trends
    `;

    res.json({ framework });
  } catch (error) {
    console.error('Error generating framework:', error);
    res.status(500).json({ error: 'Failed to generate framework' });
  }
});

// New endpoint for generating keywords
app.post('/api/generate-keywords', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { content } = req.body;
    
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    tfidf.addDocument(content);

    const keywords = tfidf.listTerms(0)
      .slice(0, 10)
      .map(item => ({
        keyword: item.term,
        score: Math.round(item.tfidf * 100) / 100
      }));

    res.json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Failed to generate keywords' });
  }
});

// New endpoint for getting recommendations
app.post('/api/get-recommendations', verifyToken, async (req: CustomRequest, res: express.Response) => {
  try {
    const { userContent, userInterests } = req.body;

    // This is a simplified version. You might want to implement more sophisticated recommendation logic.
    const recommendations = userInterests.map(interest => ({
      topic: interest,
      type: 'interest',
      relevance: Math.random()  // Mock relevance score
    }));

    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Add more endpoints as needed

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});