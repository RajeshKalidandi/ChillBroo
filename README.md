# 🚀 ChillBroo - AI-Powered Social Media Content Generator

![ChillBroo Logo](public/images/logo.png)

[![GitHub license](https://img.shields.io/github/license/RajeshKalidandi/chillbroo.svg)](https://github.com/RajeshKalidandi/chillbroo/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/RajeshKalidandi/chillbroo.svg)](https://github.com/RajeshKalidandi/chillbroo/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/RajeshKalidandi/chillbroo.svg)](https://github.com/RajeshKalidandi/chillbroo/issues)

ChillBroo is a cutting-edge SaaS application that leverages AI to generate and optimize social media content across various platforms. By harnessing the power of natural language processing and trend analysis, ChillBroo provides tailored content recommendations and frameworks to elevate your social media presence.

## 🌟 Key Features

- 🤖 AI-powered content generation using Upstage Solar Pro Preview and Mistral AI
- 📊 Dynamic content framework selection
- 🔑 Keyword suggestions and analysis
- 📈 Personalized content recommendations
- 🔐 Secure user authentication with Firebase
- 📉 Advanced analytics dashboard
- 🔗 Social media platform integration (simulated)
- 👤 User profile and settings management
- 🎨 Responsive and user-friendly interface
- 📝 Template management system
- 👥 Team collaboration features
- ⚡ Rate limiting and usage tracking
- 🌐 Web scraping for real-time content insights
- 🔄 Fallback AI model implementation
- 📱 Social media post previews
- 🔍 Trending topics integration

## 🛠️ Tech Stack

- Frontend: React with TypeScript, Vite
- Backend: Node.js with Express
- Database: Firebase Firestore
- Authentication: Firebase Authentication
- Styling: Tailwind CSS
- AI Integration: Upstage Solar Pro Preview, Mistral AI
- State Management: React Hooks
- Charts: Recharts

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RajeshKalidandi/chillbroo.git
   cd chillbroo
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory for frontend environment variables.
   - Create a `.env` file in the `server` directory for backend environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. In a separate terminal, start the backend server:
   ```bash
   cd server && npm start
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## 📁 Project Structure

- `src/`: Frontend React application
  - `components/`: Reusable React components
  - `pages/`: Main page components
  - `utils/`: Utility functions and helpers
  - `firebaseConfig.ts`: Firebase configuration
- `server/`: Backend Node.js server
  - `src/index.ts`: Main server file with API endpoints
  - `src/firebaseAdmin.ts`: Firebase Admin SDK setup

## 🎯 Current Progress

- ✅ User authentication with Firebase
- ✅ Onboarding process for new users
- ✅ Dashboard with quick action cards and trending topics
- ✅ Content generation using multiple AI models (Upstage and Mistral)
- ✅ Dynamic content framework selection
- ✅ Keyword generation and recommendations
- ✅ Advanced analytics implementation with charts
- ✅ Social media platform integration (simulated)
- ✅ User settings and preferences management
- ✅ Responsive design with Tailwind CSS
- ✅ Template management system (predefined and custom templates)
- ✅ Content preview for different social media platforms
- ✅ Error handling and user feedback improvements
- ✅ Team collaboration features
- ✅ Rate limiting and usage tracking
- ✅ Web scraping for real-time content insights
- ✅ Fallback AI model implementation
- ✅ Loading spinner for better UX
- ✅ Toast notifications for user feedback
- ✅ Trending topics integration in the dashboard
- ✅ Improved social media post previews
- ✅ Enhanced content generation with recent information option
- ✅ Multi-language support (English, Spanish, French)
- ✅ Dark mode / Light mode toggle
- ✅ Pricing page with tiered plans and annual/monthly options
- ✅ Error boundary for better error handling
- ✅ Improved authentication flow with protected routes
- ✅ Integrated cryptocurrency payments using Coinbase Commerce
- ✅ Added option to choose between credit card and cryptocurrency payments

- ✅ Implemented credit-based system for content generation
- ✅ Added Usage dashboard to track credit usage and payment history
- ✅ Integrated payment processing for credit purchases
- ✅ Updated Pricing page with credit information and freemium option
- ✅ Implemented backend endpoints for usage tracking and payment processing
- ✅ Added credit check before content generation to ensure sufficient balance
- ✅ Implemented automatic credit deduction for content generation
- ✅ Enhanced LoadingSpinner component with logo and improved design
- ✅ Updated Footer component with logo and additional links
- ✅ Improved ErrorBoundary component with branded error page
- ✅ Refined Header component with responsive design and user dropdown
- ✅ Implemented dark mode / light mode toggle with persistent user preference
- ✅ Updated UI components to support dark mode styling
- ✅ Improved TrendingTopics component with real-time data fetching
- ✅ Enhanced ContentCreationResources component with dynamic resource loading
- ✅ Implemented UserRecommendations component for personalized suggestions

## 🚀 Recent Progress

- ✅ Implemented dark mode functionality with system preference detection
- ✅ Optimized API calls with caching mechanism
- ✅ Improved responsive design for better mobile experience
- ✅ Enhanced dashboard layout with full-width design
- ✅ Implemented lazy loading for better performance
- ✅ Added error boundary for improved error handling
- ✅ Optimized images for faster loading
- ✅ Implemented virtualized lists for handling large datasets
- ✅ Added theme toggle in the header for easy switching between light and dark modes
- ✅ Improved accessibility features throughout the application

## 🔜 Next Steps

- [ ] Implement advanced caching mechanisms for API responses
- [ ] Enhance error handling and logging across the application
- [ ] Implement user feedback system for content quality improvement
- [ ] Develop a comprehensive onboarding tutorial for new users
- [ ] Implement social sharing features for generated content
- [ ] Enhance accessibility features throughout the application
- [ ] Implement real-time collaboration features for team accounts
- [ ] Develop a plugin system for extending application functionality
- [ ] Implement advanced SEO optimization for generated content

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For any queries or suggestions, please open an issue or contact us at [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ by [RajeshKalidandi](https://github.com/RajeshKalidandi/)
