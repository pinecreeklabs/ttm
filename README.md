# AI Expert Network

A freemium voice chat application that connects users with specialized AI experts and provides product evaluations. Users get a free 30-second trial before being prompted to upgrade to premium access.

## Features

- **Free Trial**: 30 seconds of free voice conversation with AI assistant
- **Premium AI Experts**: Specialized agents for different domains:
  - Crypto Expert (Cryptocurrency & Blockchain)
  - Business Advisor (Strategy & Growth)  
  - Health Coach (Wellness & Fitness)
- **Product Reviews**: Detailed evaluations of popular SaaS products (Ramp, Clay.io, Notion)
- **Real-time Voice Chat**: WebRTC-powered voice conversations
- **Dark Mode**: Modern, accessible interface
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Voice AI**: ElevenLabs Conversational AI SDK
- **Real-time Communication**: WebRTC
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- ElevenLabs API key

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your ElevenLabs API key to `.env.local`
5. Run: `npm run dev`

## Security Notes

- ✅ API keys are stored securely in environment variables
- ✅ No secrets are committed to version control
- ✅ Server-side API routes protect sensitive operations
- ✅ `.env.local` is excluded from git

## Deployment Ready

The codebase is ready for production deployment with proper security measures in place.
