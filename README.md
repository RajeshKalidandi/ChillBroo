# ChillBroo - AI-Powered Social Media Content Generator

ChillBroo is a SaaS application that uses AI to generate and optimize social media content for various platforms. It leverages natural language processing and trend analysis to provide content recommendations and frameworks.

## Features

- AI-powered content generation
- Content optimization framework
- Keyword suggestions and analysis
- Content recommendations based on user interests and trends
- User authentication and profile management
- Analytics dashboard
- Template management

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: Supabase
- Authentication: Supabase Auth
- Styling: Tailwind CSS
- API Integrations: Google Trends API, Wikipedia API
- NLP: natural library

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.