
# StudyBuddy AI Learning Platform

StudyBuddy is a modern web application designed to help students learn more effectively through AI-powered study tools, collaborative study groups, and progress tracking.

## Features

- **AI-powered Study Tutor**: Get instant answers to your study questions using Google's Gemini AI
- **Flashcards**: Create and study AI-generated flashcards on any topic
- **Study Groups**: Collaborate with other students in virtual study groups
- **Progress Tracking**: Monitor your learning progress over time

## Tech Stack

This project is built with modern web technologies:

- **Frontend**:
  - React 18+ with TypeScript
  - Vite for fast development and building
  - React Router for navigation
  - Tailwind CSS for styling
  - Shadcn UI component library
  - TanStack Query for data fetching

- **Backend**:
  - Supabase for authentication, database, and serverless edge functions
  - Google Gemini AI for intelligent study assistance

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd studybuddy
```

2. Install dependencies:
```sh
npm install
# or
bun install
```

3. Set up your Supabase project and add the Gemini API key as a secret:
   - Navigate to your Supabase project dashboard
   - Go to Project Settings > API
   - Under "Edge Functions", add a new secret named `GEMINI_API_KEY` with your API key value

4. Start the development server:
```sh
npm run dev
# or
bun run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application can be deployed using Lovable's built-in deployment features:

1. Click on "Publish" in the top right corner of the Lovable editor
2. Follow the prompts to deploy your application

You can also connect a custom domain by navigating to Project > Settings > Domains in Lovable.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
