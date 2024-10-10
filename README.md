# ChillBroo - AI-Powered Social Media Content Generator

ChillBroo is a SaaS application that uses AI to generate social media content for various platforms. It's built with React, TypeScript, and Supabase for authentication.

## Features

- User registration and authentication
- AI-powered content generation
- Content templates management
- Analytics dashboard
- Pricing plans

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase (for authentication)
- Vite (for build tooling)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chillbroo.git
   cd chillbroo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase account and project
   - Copy your Supabase URL and anon key
   - Update `src/supabaseClient.ts` with your Supabase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Project Structure

- `src/components`: Reusable React components
- `src/pages`: Main page components
- `src/supabaseClient.ts`: Supabase client configuration
- `src/App.tsx`: Main application component with routing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.