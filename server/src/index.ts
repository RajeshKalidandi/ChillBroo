import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import natural from 'natural';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Add these type definitions
interface DatamuseWord {
  word: string;
  score: number;
}

interface GitHubTrend {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));

app.use(express.json());

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

app.post('/api/generate-framework', async (req, res) => {
  try {
    const { content, platform } = req.body;
    
    // Use TF-IDF to extract important topics
    const tfidf = new TfIdf();
    tfidf.addDocument(content);
    const topics = tfidf.listTerms(0).slice(0, 5).map(item => item.term);

    // Generate framework based on extracted topics
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

app.post('/api/generate-keywords', async (req, res) => {
  try {
    const { content } = req.body;
    
    // Use TF-IDF to extract important keywords from the content
    const tfidf = new TfIdf();
    tfidf.addDocument(content);

    const keywords = tfidf.listTerms(0)
      .slice(0, 10)
      .map(item => ({
        keyword: item.term,
        score: Math.round(item.tfidf * 100) / 100
      }));

    // Use datamuse API to get related words
    const topKeyword = keywords[0].keyword;
    const datamuseResponse = await axios.get<DatamuseWord[]>(`https://api.datamuse.com/words?ml=${topKeyword}&max=5`);
    const relatedWords = datamuseResponse.data.map((word: DatamuseWord) => ({
      keyword: word.word,
      score: Math.round(word.score / 100) / 100
    }));

    const combinedKeywords = [...keywords, ...relatedWords]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json({ keywords: combinedKeywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Failed to generate keywords' });
  }
});

app.post('/api/store-user-data', async (req, res) => {
  try {
    const { name, company, industry, platforms, contentType, userId } = req.body;

    console.log('Received user data:', { name, company, industry, platforms, contentType, userId });

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        name,
        company,
        industry,
        platforms,
        content_type: contentType
      }, {
        onConflict: 'id'
      });

    if (error) throw error;

    console.log('User data stored successfully:', data);
    res.status(200).json({ message: 'User data stored successfully', data });
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).json({ error: 'Failed to store user data' });
  }
});

app.post('/api/update-user-data', async (req, res) => {
  try {
    const { tempUserId, newUserId } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ id: newUserId })
      .match({ id: tempUserId });

    if (error) throw error;

    res.status(200).json({ message: 'User data updated successfully', data });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
});

async function getTrendingRepos(): Promise<GitHubTrend[]> {
  const response = await axios.get('https://github.com/trending');
  const $ = cheerio.load(response.data);
  const repos: GitHubTrend[] = [];

  $('article.Box-row').each((_, elem) => {
    const $elem = $(elem);
    const name = $elem.find('h3').text().trim().replace(/\s+/g, '');
    const url = `https://github.com${$elem.find('h3 a').attr('href')}`;
    const description = $elem.find('p.col-9').text().trim();
    const language = $elem.find('[itemprop="programmingLanguage"]').text().trim();
    const stars = parseInt($elem.find('a.muted-link').first().text().trim().replace(',', ''), 10) || 0;

    repos.push({ name, url, description, language, stars });
  });

  return repos;
}

app.post('/api/get-recommendations', async (req, res) => {
  try {
    const { userContent, userInterests } = req.body;

    // Extract key terms from user content and interests
    const tfidf = new TfIdf();
    tfidf.addDocument(userContent);
    userInterests.forEach((interest: string) => tfidf.addDocument(interest));

    const keyTerms = tfidf.listTerms(0).slice(0, 5).map(item => item.term);

    // Get trending topics from GitHub
    const trendingRepos = await getTrendingRepos();

    const trends = trendingRepos
      .filter((repo: GitHubTrend) => 
        keyTerms.some(term => 
          repo.name.toLowerCase().includes(term.toLowerCase()) || 
          repo.description.toLowerCase().includes(term.toLowerCase())
        )
      )
      .map((repo: GitHubTrend) => ({
        topic: repo.name,
        description: repo.description,
        url: repo.url,
        stars: repo.stars,
        language: repo.language
      }))
      .slice(0, 10);

    // Get related topics from Wikipedia
    const wikiPromises = keyTerms.map(term =>
      axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: term,
          format: 'json',
          utf8: 1,
          srlimit: 5
        }
      }).then(response => response.data.query.search.map((result: any) => ({
        title: result.title,
        snippet: result.snippet.replace(/<\/?span[^>]*>/g, '')
      })))
    );

    const wikiResults = await Promise.all(wikiPromises);
    const relatedTopics = wikiResults.flat().slice(0, 10);

    // Combine recommendations
    const recommendations = [
      ...trends.map((trend: { topic: string; description: string; url: string; stars: number; language: string }) => 
        ({ ...trend, type: 'trend' as const })
      ),
      ...relatedTopics.map(topic => ({ ...topic, type: 'topic' as const }))
    ];

    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});