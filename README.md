# ChillBroo - AI-Powered Social Media Content Generator

ChillBroo is a SaaS application that uses AI to generate and optimize social media content for various platforms. It leverages natural language processing, web scraping, and trend analysis to provide content recommendations and frameworks.

## Current Progress

- Set up the project structure with React, TypeScript, and Vite
- Implemented user authentication using Supabase
- Created an onboarding process for new users
- Developed a dashboard with quick action cards and statistics
- Implemented backend server with Express.js
- Integrated GitHub trending topics for content recommendations
- Set up Supabase database for storing user profiles and preferences

## Tech Stack

- Frontend: React with TypeScript, Vite
- Backend: Node.js with Express
- Database: Supabase
- Authentication: Supabase Auth
- Styling: Tailwind CSS
- API Integrations: Wikipedia API, GitHub Trending (web scraping)
- NLP: natural library
- Web Scraping: cheerio

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chillbroo.git
   cd chillbroo
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3001
   ```

   Create a `.env` file in the `server` directory and add:
   ```bash
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. In a separate terminal, start the backend server:
   ```bash
   cd server
   npm start
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Project Structure

- `src/`: Frontend React application
  - `components/`: Reusable React components
  - `pages/`: Main page components
  - `supabaseClient.ts`: Supabase client configuration
- `server/`: Backend Node.js server
  - `src/index.ts`: Main server file with API endpoints

## Next Steps

- Implement AI-powered content generation
- Create a template management system
- Develop an analytics dashboard
- Integrate with more social media platforms
- Enhance the recommendation engine with machine learning

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.