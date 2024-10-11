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
- ✅ Added 100 free credits for newly registered users
- ✅ Integrated credit check and automatic deduction in ContentGenerator
- ✅ Updated Dashboard to display user's available credits
- ✅ Improved Login and Register components to handle initial credit allocation
- ✅ Created a useCredits hook for real-time credit tracking across components
- ✅ Enhanced user experience with credit-aware content generation process
- ✅ Implemented real-time credit updates using Firestore listeners
- ✅ Added credit display in the Dashboard for better user awareness
- ✅ Optimized performance with lazy loading and memoization techniques
- ✅ Implemented updateCredits function to deduct credits after content generation
- ✅ Added CreditStatus component to inform users about their credit balance
- ✅ Integrated low credit warning and purchase option in the UI
- ✅ Enhanced ContentGenerator to prevent generation when credits are insufficient

## 🔜 Upcoming Features

- [ ] Implement a credit purchase system
- [ ] Create a detailed usage history page
- [ ] Develop tiered pricing plans based on credit usage
- [ ] Implement credit expiration and renewal system
- [ ] Add credit gifting or transfer feature for team accounts
- [ ] Develop an affiliate program for credit referrals
- [ ] Implement credit bonuses for consistent usage or achievements
- [ ] Create a credit top-up reminder system
- [ ] Develop a credit usage analytics dashboard for users

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

## 🚀 Latest Updates

- ✅ Implemented Redux for state management
- ✅ Created user and content slices for Redux store
- ✅ Integrated Redux with Dashboard component
- ✅ Implemented pagination for generated content in Dashboard
- ✅ Created useApiCache hook for efficient API calls
- ✅ Optimized Firebase queries with composite indexes
- ✅ Improved performance with lazy loading and code splitting
- ✅ Enhanced error handling and loading states
- ✅ Implemented real-time credit updates across components
- ✅ Improved dark mode implementation and user preference detection

## 🔜 Upcoming Features

- [ ] Implement infinite scrolling for content lists
- [ ] Add data visualization for analytics
- [ ] Implement advanced search and filtering for generated content
- [ ] Create a user onboarding tutorial
- [ ] Develop a mobile app version
- [ ] Implement multi-language support
- [ ] Add social sharing capabilities for generated content
- [ ] Develop an API for third-party integrations
- [ ] Implement A/B testing for content performance
- [ ] Create a content calendar and scheduling feature

## 🚀 Recent Updates

- ✅ Implemented freemium model with 100 free credits for new users
- ✅ Updated Pricing page to reflect new plan structure
- ✅ Integrated credit system with content generation process
- ✅ Added CreditStatus component for real-time credit display
- ✅ Enhanced user registration process with plan selection
- ✅ Optimized Dashboard with pagination for generated content
- ✅ Implemented Redux for global state management
- ✅ Created custom hooks for API caching and credit management
- ✅ Improved error handling and loading states across components
- ✅ Enhanced dark mode implementation with system preference detection

## 🔜 Next Steps

- [ ] Implement credit purchase system in the Checkout page
- [ ] Create a detailed credit usage history in the Usage page
- [ ] Develop an onboarding tutorial for new users
- [ ] Implement team collaboration features for shared credits
- [ ] Enhance Analytics page with credit usage insights
- [ ] Create an API documentation page for developers
- [ ] Implement a referral system for credit bonuses
- [ ] Develop a mobile app version of ChillBroo
- [ ] Implement advanced AI model selection for content generation
- [ ] Create a content calendar feature for scheduling posts
