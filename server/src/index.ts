import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import natural from 'natural';
import axios from 'axios';
import googleTrends from 'google-trends-api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

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
    const datamuseResponse = await axios.get(`https://api.datamuse.com/words?ml=${topKeyword}&max=5`);
    const relatedWords = datamuseResponse.data.map(word => ({
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

app.post('/api/get-recommendations', async (req, res) => {
  try {
    const { userContent, userInterests } = req.body;

    // Extract key terms from user content and interests
    const tfidf = new TfIdf();
    tfidf.addDocument(userContent);
    userInterests.forEach((interest: string) => tfidf.addDocument(interest));

    const keyTerms = tfidf.listTerms(0).slice(0, 5).map(item => item.term);

    // Get trending topics from Google Trends
    const trendPromises = keyTerms.map(term => 
      googleTrends.dailyTrends({
        trendDate: new Date(),
        geo: 'US',
      }).then((results: string) => {
        const data: googleTrends.TrendResult = JSON.parse(results);
        return data.default.trendingSearchesDays[0].trendingSearches
          .filter(search => search.title.query.toLowerCase().includes(term.toLowerCase()))
          .map(search => ({
            topic: search.title.query,
            traffic: search.formattedTraffic
          }));
      })
    );

    const trendResults = await Promise.all(trendPromises);
    const trends = trendResults.flat().slice(0, 10);

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

    // Combine and rank recommendations
    const recommendations = [
      ...trends.map(trend => ({ ...trend, type: 'trend' as const })),
      ...relatedTopics.map(topic => ({ ...topic, type: 'topic' as const }))
    ].sort((a, b) => (b.traffic || '0').localeCompare(a.traffic || '0'));

    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});