
# StudyBuddy AI Learning Platform

**Author:** Tanay Shrivastava

StudyBuddy AI is an intelligent learning platform that revolutionizes how students study and collaborate. Built with modern web technologies and powered by Google's Gemini AI, it provides a comprehensive suite of tools to enhance the learning experience through artificial intelligence and collaborative features.

## 🚀 Features

### Core Functionality
- **AI-Powered Study Tutor**: Get instant, personalized answers to study questions using Google's Gemini AI
- **Smart Flashcards**: Create and study AI-generated flashcards tailored to any topic or subject
- **Study Groups**: Create or join virtual study groups with real-time messaging and collaboration
- **Progress Analytics**: Monitor learning progress with detailed insights and performance tracking
- **Secure Authentication**: Robust user authentication and data protection with Supabase

### Advanced Capabilities
- **Real-time Chat**: Seamless communication within study groups
- **Intelligent Content Generation**: AI-powered content creation for enhanced learning
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS and Shadcn UI

## 🛠️ Technology Stack

This project leverages cutting-edge technologies for optimal performance and user experience:

### Frontend
- **React 18+** with TypeScript for type-safe development
- **Vite** for lightning-fast development and building
- **React Router** for seamless navigation
- **Tailwind CSS** for modern, responsive styling
- **Shadcn UI** component library for consistent design
- **Framer Motion** for smooth animations
- **TanStack Query** for efficient data fetching and state management

### Backend & Services
- **Supabase** for authentication, database, and serverless edge functions
- **Google Gemini AI** for intelligent study assistance
- **PostgreSQL** database with Row Level Security (RLS)
- **Edge Functions** for serverless API endpoints

### Security & Performance
- **Row Level Security (RLS)** for data protection
- **Environment-based configuration** for secure API key management
- **Optimized bundle size** with code splitting
- **Progressive Web App (PWA)** capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Supabase account
- Google Gemini API key

### Installation & Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd studybuddy-ai
```

2. **Install dependencies:**
```bash
npm install
# or
bun install
```

3. **Configure Supabase:**
   - Create a new Supabase project
   - Navigate to Project Settings > API
   - Note your project URL and anon key
   - Set up the database schema (tables for groups, group_members, group_messages, profiles)

4. **Add Gemini API Key:**
   - Go to your Supabase project dashboard
   - Navigate to Project Settings > Edge Functions
   - Add a new secret named `GEMINI_API_KEY` with your Google Gemini API key

5. **Start the development server:**
```bash
npm run dev
# or
bun run dev
```

6. **Open your browser:**
Navigate to `http://localhost:5173` to see the application

## 📊 Database Schema

The application uses the following database structure:

- **profiles**: User profile information
- **groups**: Study group details with unique codes
- **group_members**: Many-to-many relationship between users and groups
- **group_messages**: Real-time chat messages within groups

## 🔐 Security Features

- **Authentication**: Secure user registration and login with Supabase Auth
- **Data Protection**: Row Level Security (RLS) policies on all database tables
- **API Security**: Secure API key management through Supabase secrets
- **Input Validation**: Comprehensive validation for all user inputs
- **HTTPS**: Secure communication protocols

## 🌐 Deployment

The application supports multiple deployment options:

### Quick Deploy
1. Connect your GitHub repository to your preferred hosting platform
2. Set environment variables for Supabase configuration
3. Deploy with a single click

### Custom Domain
- Configure custom domains through your hosting provider
- Set up SSL certificates for secure connections
- Configure CDN for optimal performance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Write comprehensive tests for new features
- Update documentation for any changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Tanay Shrivastava**
- A passionate developer focused on creating innovative educational technology solutions
- Specialized in modern web development with React, TypeScript, and AI integration

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent tutoring system
- Supabase for providing robust backend infrastructure
- The open-source community for the amazing tools and libraries used in this project

---

*StudyBuddy AI - Empowering students with intelligent learning tools and collaborative study environments.*
