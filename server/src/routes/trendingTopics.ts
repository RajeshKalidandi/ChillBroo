import express from 'express';
import axios from 'axios';
import { parseString } from 'xml2js';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

const RSS_FEEDS = [
  'http://rss.cnn.com/rss/cnn_topstories.rss',
  'http://feeds.bbci.co.uk/news/rss.xml',
  'https://www.reddit.com/r/technology/.rss',
];

router.get('/api/trending-topics', authenticateUser, async (req, res) => {
  try {
    const feedPromises = RSS_FEEDS.map(feed => axios.get(feed));
    const feedResponses = await Promise.all(feedPromises);
    
    const topics = new Set<string>();
    
    for (const response of feedResponses) {
      const feed = await parseRSS(response.data);
      feed.rss.channel[0].item.forEach((item: any) => {
        const words = item.title[0].split(' ');
        words.forEach((word: string) => {
          if (word.length > 3 && !commonWords.includes(word.toLowerCase())) {
            topics.add(word);
          }
        });
      });
    }

    res.json({ trendingTopics: Array.from(topics).slice(0, 9) });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
});

function parseRSS(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

const commonWords = ['the', 'and', 'for', 'with', 'you', 'that', 'this', 'are', 'from', 'have'];

export default router;