# Prism AI - AI-Powered Website Generation Platform

**Prism AI** is a full-stack, AI-driven web application that enables users to generate, preview, and deploy fully functional websites using natural language prompts. Powered by advanced AI models, Stripe for payments, and modern web technologies, Prism AI streamlines the website creation process for users of all technical levels.

## 🌟 Key Features

### Frontend (React + TypeScript + Vite)
- **AI-Powered Website Generation**: Describe your website idea in plain English, and Prism AI generates production-ready HTML/CSS/JavaScript
- **Real-Time Preview**: Instantly see live previews of generated websites before publishing
- **Project Management**: Create, edit, save, and organize multiple website projects
- **Version Control**: Save and switch between different versions of your website code
- **Conversational UI**: Interactive chat-based refinement system for iterative website improvements
- **Credit-Based System**: Flexible credit purchasing with tiered pricing plans (Basic, Pro, Enterprise)
- **User Authentication**: Secure email/password authentication with better-auth
- **Responsive Design**: Mobile-first UI built with Tailwind CSS v4 and modern React hooks
- **Community Section**: Browse and discover projects created by other users
- **Settings & Account Management**: Personalized user settings and account controls

### Backend (Node.js + Express + TypeScript)
- **RESTful API**: Clean, well-structured REST endpoints for all application features
- **AI Integration**: Google Gemini 2.0 Flash AI model for:
  - Prompt enhancement (converts user ideas into detailed website specifications)
  - Code generation (creates production-ready HTML/CSS/JavaScript with Tailwind CSS)
- **Payment Processing**: Stripe integration for secure credit purchases
- **Webhook Handling**: Automated transaction processing from Stripe payment events
- **Database**: PostgreSQL with Prisma ORM for reliable data management
- **Authentication**: better-auth for session management and user security
- **CORS & Security**: Properly configured CORS for cross-origin requests with credential support

### Database (PostgreSQL + Prisma)
- **User Management**: Stores user profiles, authentication info, and credit balances
- **Project Storage**: Saves website projects with metadata and current state
- **Code Versions**: Version history for each project's generated code
- **Conversations**: Stores chat history for AI refinement interactions
- **Transactions**: Records all credit purchases and payment history
- **Sessions**: Manages user authentication sessions securely

## 🏗️ Architecture Overview

```
Prism AI
├── Client (React + TypeScript + Vite)
│   ├── Pages
│   │   ├── Home - Landing page with feature showcase
│   │   ├── Pricing - Credit purchase plans
│   │   ├── Community - Discover published projects
│   │   ├── MyProjects - User's saved projects
│   │   ├── Projects - Editor & generator interface
│   │   ├── Preview - Live website preview
│   │   ├── View - Public project viewer
│   │   ├── Settings - User preferences
│   │   └── Auth - Login & registration
│   ├── Components
│   │   ├── Navbar - Navigation header
│   │   ├── EditorPanel - Code editing interface
│   │   ├── ProjectPreview - Live preview window
│   │   ├── Sidebar - Navigation sidebar
│   │   ├── Footer - Page footer
│   │   └── LoaderSteps - Generation progress indicator
│   └── Services
│       ├── axios config (API calls with credentials)
│       ├── auth-client (Better-auth integration)
│       └── utils (Helper functions)
│
├── Server (Node.js + Express + TypeScript)
│   ├── Controllers
│   │   ├── userController - User & project operations
│   │   ├── projectController - Project-specific actions
│   │   └── stripeWebhook - Payment event handling
│   ├── Routes
│   │   ├── userRoutes - User & credit endpoints
│   │   └── projectRoutes - Project management endpoints
│   ├── Middleware
│   │   └── auth - Session authentication & validation
│   ├── Lib
│   │   ├── auth - Better-auth configuration
│   │   └── prisma - Database connection
│   └── Configs
│       └── openai - Gemini AI model setup
│
└── Database (PostgreSQL)
    ├── User (profiles, credits, creation count)
    ├── WebsiteProject (projects, metadata, code)
    ├── Version (code versions, history)
    ├── Conversation (chat/refinement history)
    ├── Transaction (payment records)
    └── Auth tables (sessions, accounts, verifications)
```

## 📋 Complete Feature List

### User Features
- ✅ **Email/Password Registration & Login**
- ✅ **Credit System** - Start with 30 free credits (configurable in schema)
- ✅ **Project Creation** - Generate new websites with AI
- ✅ **AI-Powered Prompt Enhancement** - Converts basic ideas to detailed specifications
- ✅ **Automatic Code Generation** - Creates production-ready HTML + Tailwind CSS
- ✅ **Live Preview** - Real-time website preview in browser
- ✅ **Version History** - Save and compare multiple versions
- ✅ **Conversational Refinement** - Ask AI to modify designs iteratively
- ✅ **Project Publishing** - Make websites publicly viewable
- ✅ **Project Sharing** - View other users' published projects
- ✅ **Credit Purchasing** - Buy credits via Stripe (3 tier plans)
- ✅ **Account Settings** - Manage preferences and profile
- ✅ **Usage Tracking** - Monitor remaining credits

### Developer Features
- ✅ **REST API** - Fully documented endpoints
- ✅ **Session Authentication** - Secure, cookie-based auth
- ✅ **Type Safety** - Full TypeScript throughout
- ✅ **Database Migrations** - Prisma schema with versioning
- ✅ **Payment Webhooks** - Automatic credit updates on payment success
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **CORS Support** - Cross-origin requests enabled
- ✅ **Environment Configuration** - Secrets management via .env

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** database (local or cloud like Neon)
- **API Keys**:
  - Google Gemini API key (`AI_API_KEY`)
  - Stripe Secret & Webhook keys
  - Better-auth secret

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Prism

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
npm install -g prisma
```

### Environment Setup

**Client (.env)**
```env
VITE_BASEURL=http://localhost:3000
```

**Server (.env)**
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/prism_db

# Authentication
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here

# AI Model
AI_API_KEY=your-google-gemini-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS
TRUSTED_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
NODE_ENV=development
```

### Database Setup

```bash
cd server

# Create database and run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed database
npx prisma db seed
```

### Running Locally

**Terminal 1 - Client**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Server**
```bash
cd server
npm run server
# Runs on http://localhost:3000
```

## 📊 API Endpoints

### User Routes (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/credits` | ✅ | Get user's remaining credits |
| POST | `/project` | ✅ | Create new website project |
| GET | `/projects` | ✅ | List all user projects |
| GET | `/project/:projectId` | ✅ | Get single project details |
| GET | `/publish-toggle/:projectId` | ✅ | Publish/unpublish project |
| POST | `/purchase-credits` | ✅ | Initiate credit purchase (Stripe) |

### Project Routes (`/api/project`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:projectId` | ✅ | Get project for editing |
| POST | `/chat/:projectId` | ✅ | Send message to AI for refinements |

### Auth Routes (`/api/auth/*`)
- Handled by better-auth automatically
- Includes: sign-up, sign-in, sign-out, session check

## 💳 Credit System

- **Free Credits**: 30 per new user
- **Plans Available**:
  - **Basic** ($5 USD) → 100 credits
  - **Pro** ($19 USD) → 400 credits
  - **Enterprise** ($49 USD) → 1000 credits
- **Cost Per Action**:
  - Website Creation/Revision: 5 credits
- **Deductions**: Credits deducted only after successful generation

### Modifying Default Credits
Edit `server/prisma/schema.prisma`:
```prisma
model User {
  // ...
  credits       Int    @default(30)  // Change 30 to desired amount
  // ...
}
```

Then create and run migration:
```bash
npx prisma migrate dev --name update-default-credits
```

## 🔐 Security Features

- **Session-Based Auth**: HTTP-only, secure cookies
- **CORS Protection**: Whitelist specific origins
- **Environment Secrets**: Never commit `.env` files
- **Prisma ORM**: Prevents SQL injection
- **TypeScript**: Type safety across codebase
- **Stripe Webhooks**: Signature verification for payments

## 🎨 Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 + custom CSS
- **UI Components**: Better-auth-ui, custom components
- **HTTP Client**: Axios with credentials
- **Notifications**: Sonner toast library
- **Routing**: React Router v7

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma v7
- **Authentication**: better-auth v1.4.9
- **AI**: Google Gemini 2.0 Flash API
- **Payments**: Stripe
- **CORS**: express-cors

### DevTools
- **Type Checking**: TypeScript, ESLint
- **Dev Server**: Vite dev server, Nodemon
- **Build**: tsc, Vite bundler

## 📦 Deployment

### Deploy Client to Vercel

1. Create `client/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-api-domain.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. Add Vercel environment variable:
   - `VITE_BASEURL` = `https://your-api-domain.com`

### Deploy Server to Vercel

1. Create `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node",
      "config": {
        "runtime": "nodejs18.x",
        "maxLambdaSize": "50mb",
        "includeFiles": ["prisma/**", "generated/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.ts"
    }
  ]
}
```

2. Set Vercel environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `BETTER_AUTH_URL` (your production API URL)
   - `BETTER_AUTH_SECRET` (secure random string)
   - `AI_API_KEY` (Gemini API key)
   - `STRIPE_SECRET_KEY` (Stripe secret)
   - `STRIPE_WEBHOOK_SECRET` (Stripe webhook secret)
   - `TRUSTED_ORIGINS` (comma-separated: `https://your-client.com`)
   - `NODE_ENV` = `production`

3. Configure Prisma for serverless:
```bash
# In server/.env
DATABASE_URL=postgresql://...?schema=public
```

## 🧪 Testing & Validation

```bash
# Run TypeScript compiler check
npm run build

# Run linting
npm run lint

# Type checking
tsc --noEmit
```

## 📝 Environment Variables Reference

### All Required Variables
```env
# CLIENT
VITE_BASEURL                  # API base URL

# SERVER
DATABASE_URL                  # PostgreSQL connection
BETTER_AUTH_URL              # Auth service URL
BETTER_AUTH_SECRET           # JWT/session secret
AI_API_KEY                   # Gemini API key
STRIPE_SECRET_KEY            # Stripe payment key
STRIPE_WEBHOOK_SECRET        # Stripe webhook secret
TRUSTED_ORIGINS              # CORS allowed origins
NODE_ENV                     # development|production
```

## 🔄 Workflow

1. **User Registration** → Receives 30 free credits
2. **Project Creation** → Enters natural language description
3. **Prompt Enhancement** → AI refines the prompt for better output
4. **Code Generation** → AI generates HTML + Tailwind CSS website
5. **Live Preview** → User sees generated website instantly
6. **Refinement Loop** → User can ask AI to modify design
7. **Version Saving** → Each iteration saved as separate version
8. **Publishing** → User publishes website (adds to community)
9. **Credit Purchase** → If credits run out, user buys more via Stripe

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `TRUSTED_ORIGINS` env var includes client URL |
| Stripe webhook fails | Verify webhook secret in Stripe dashboard |
| AI generation errors | Ensure `AI_API_KEY` is valid and has quota |
| Database connection | Verify `DATABASE_URL` and network access |
| Session not persisting | Check `BETTER_AUTH_SECRET` is set and consistent |

## 📚 Additional Resources

- [Better-auth Docs](https://www.better-auth.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Google Gemini API](https://ai.google.dev/)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Developed by**: Your Name / Team  
**LinkedIn**: [Link to profile]  
**Email**: contact@example.com

## 🙏 Acknowledgments

- Google Gemini AI for code generation
- Stripe for payment processing
- Better-auth for authentication
- Tailwind CSS for styling
- Vercel for deployment

---

**Happy building with Prism AI! 🎨✨**
