import express from 'express';
import { auth, db } from '../firebaseAdmin';
import NodeCache from 'node-cache';
import { CronJob } from 'cron';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  link: string;
}

// A/B Testing variants
const variants = ['A', 'B'];

// Background job to pre-generate recommendations
const preGenerateRecommendations = new CronJob('0 */1 * * *', async () => {
  console.log('Pre-generating recommendations');
  const users = await db.collection('users').get();
  for (const user of users.docs) {
    const userData = user.data();
    const recommendations = await generateRecommendations(userData);
    cache.set(`recommendations_${user.id}`, recommendations);
  }
});

preGenerateRecommendations.start();

router.get('/recommendations', async (req, res) => {
  try {
    // For now, let's skip the token verification and user fetching
    // const decodedToken = await auth.verifyIdToken(idToken);
    // const uid = decodedToken.uid;

    // Generate mock recommendations
    const recommendations: Recommendation[] = await generateRecommendations({});

    // Assign A/B testing variant
    const variant = variants[Math.floor(Math.random() * variants.length)];

    res.json({ recommendations, variant });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function generateRecommendations(userData: any): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  // Add some mock recommendations
  recommendations.push({
    id: uuidv4(),
    title: 'Complete Your Profile',
    description: 'Add more information to your profile to get personalized content suggestions.',
    action: 'Update Profile',
    link: '/profile',
  });

  recommendations.push({
    id: uuidv4(),
    title: 'Create More Content',
    description: 'Generate more content to improve your social media presence.',
    action: 'Generate Content',
    link: '/generate',
  });

  // Remove or comment out the parts that might be causing errors
  // such as database queries or complex logic

  return recommendations;
}

export default router;