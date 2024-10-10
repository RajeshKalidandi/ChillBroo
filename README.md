# ChillBroo - AI-Powered Social Media Content Generator

ChillBroo is a SaaS application that uses AI to generate and optimize social media content for various platforms. It leverages natural language processing, web scraping, and trend analysis to provide content recommendations and frameworks.

## Current Progress

- Set up the project structure with React, TypeScript, and Vite
- Implemented user authentication using Firebase
- Created an onboarding process for new users
- Developed a dashboard with quick action cards and statistics
- Implemented backend server with Express.js
- Integrated GitHub trending topics for content recommendations
- Migrated from Supabase to Firebase for authentication and database

## Tech Stack

- Frontend: React with TypeScript, Vite
- Backend: Node.js with Express
- Database: Firebase Firestore
- Authentication: Firebase Authentication
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
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_API_URL=http://localhost:3001
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
  - `firebaseConfig.ts`: Firebase configuration
- `server/`: Backend Node.js server
  - `src/index.ts`: Main server file with API endpoints

## Next Steps

- Implement AI-powered content generation
- Create a template management system
- Develop an analytics dashboard
- Integrate with more social media platforms
- Enhance the recommendation engine with machine learning
- Update backend to use Firebase Admin SDK
- Implement user profile management with Firestore

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.