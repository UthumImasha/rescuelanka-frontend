<img src="/public/logo.png" class="logo" width="120"/>

# Rescue Lanka - AI-Powered Disaster Response Coordination Platform


## 🌟 Overview

**Rescue Lanka** is an AI-powered disaster response coordination web application designed to enhance emergency response efficiency during natural disasters. Built for the **IntelliHack 2025 Final Round Challenge** by **Team CodeLabs**, this platform serves as a centralized coordination system for disaster response operations in Sri Lanka and beyond.

### 🎯 Problem Statement

Natural disasters such as floods, earthquakes, and wildfires often overwhelm local response systems due to:

- Lack of intelligent processing of multimodal data (text, images, voice)
- Poor task prioritization and resource allocation
- Inefficient communication between responders, volunteers, and affected individuals
- Limited real-time coordination capabilities


### 💡 Solution

Rescue Lanka addresses these challenges through an AI-agentic workflow that:

- **Intelligently processes** multimodal disaster reports
- **Prioritizes tasks** based on urgency, location, and resource availability
- **Coordinates resources** across multiple response teams
- **Enables real-time communication** between all stakeholders
- **Works offline** with automatic synchronization when connectivity is restored


## 🚀 Key Features

### 🔧 Core Functionalities

#### 1. **Request Intake \& Task Prioritization**

- Multi-modal input support (text, images, voice)
- AI-powered parsing and categorization of help requests
- Intelligent task prioritization using ML algorithms
- Automatic assignment to appropriate responders


#### 2. **Real-Time Coordination Dashboard**

- Live updates on ongoing missions and resource status
- Interactive map interface with geolocated requests
- Resource availability tracking and allocation
- Performance metrics and analytics


#### 3. **Communication Hub**

- Real-time messaging between all user roles
- LLM-powered task clarification and instructions
- Emergency alert broadcasting system
- Multi-language support


#### 4. **Offline Capability**

- On-device request generation and storage
- Automatic synchronization when online
- Local data persistence for uninterrupted operations


### 🎭 User Roles

#### 👨‍🚒 **First Responders**

- Receive prioritized task assignments
- Access real-time coordination dashboard
- View resource availability and deployment status
- Coordinate with other response teams


#### 🤝 **Volunteers**

- Register and receive task assignments
- Submit field observations and reports
- Access training materials and guidelines
- Communicate with coordination center


#### 🏠 **Affected Individuals**

- Submit help requests for food, shelter, medical aid
- Track request status and receive updates
- Access emergency contact information
- Report field conditions and observations


#### 🏛️ **Government Help Centre**

- Administer the entire platform
- Monitor system-wide performance metrics
- Manage user roles and permissions
- Generate reports and analytics


## 🏗️ Technical Architecture

### 🤖 AI Agentic Workflow

```mermaid
graph TD
    A[User Input] --> B[Input Processor Agent]
    B --> C{Content Type?}
    C -->|Text| D[NLP Agent]
    C -->|Image| E[Vision Agent]
    C -->|Voice| F[Speech Agent]
    D --> G[Classification Agent]
    E --> G
    F --> G
    G --> H[Priority Agent]
    H --> I[Assignment Agent]
    I --> J[Notification Agent]
    J --> K[Response Tracking Agent]
```


### 📁 Project Structure

```
rescue-lanka/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Authenticated routes
│   │   │   ├── volunteer/     # Volunteer dashboard
│   │   │   ├── affected/      # Affected individual dashboard
│   │   │   ├── responder/     # First responder dashboard
│   │   │   └── government/    # Government control center
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility functions and configurations
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── docs/                      # Documentation
└── tests/                     # Test files
```


## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- PostgreSQL database
- OpenAI API key


### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/rescue-lanka.git
cd rescue-lanka
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rescue_lanka"

# AI Services
OPENAI_API_KEY="your_openai_api_key"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# AgentOps
AGENTOPS_API_KEY="your_agentops_api_key"
```

4. **Set up the database**

```bash
npm run db:push
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Docker Setup

1. **Build and run with Docker Compose**

```bash
docker-compose up --build
```


## 📖 Usage

### For First Responders

1. Log in to the responder dashboard
2. View prioritized task assignments
3. Accept and update task status
4. Coordinate with other teams through the communication hub

### For Volunteers

1. Register as a volunteer
2. Complete training modules
3. Receive task assignments based on location and skills
4. Submit field reports with photos and observations

### For Affected Individuals

1. Submit help requests via text, image, or voice
2. Track request status in real-time
3. Receive updates from response teams
4. Access emergency contact information

### For Government Controllers

1. Monitor system-wide performance metrics
2. Manage user roles and permissions
3. Generate reports and analytics
4. Broadcast emergency alerts

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/signin      # User sign in
POST /api/auth/signup      # User registration
POST /api/auth/signout     # User sign out
```


### Request Management

```
POST /api/requests         # Submit new help request
GET  /api/requests         # Get user's requests
PUT  /api/requests/:id     # Update request status
```


### Task Management

```
GET  /api/tasks            # Get assigned tasks
PUT  /api/tasks/:id        # Update task status
POST /api/tasks/:id/report # Submit task report
```


### Communication

```
GET  /api/messages         # Get messages
POST /api/messages         # Send new message
POST /api/broadcast        # Send emergency alert
```


## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```


### AI Agent Testing

```bash
# Test AI workflow
npm run test:agents

# Performance testing
npm run test:performance
```


## 📊 Evaluation Metrics

The platform tracks the following key performance indicators:

- **AI Response Time**: Average time for AI agents to process requests
- **Request Fulfillment Rate**: Percentage of successfully completed requests
- **User Satisfaction Score**: Average user rating (1-5 scale)
- **Resource Utilization**: Efficiency of resource allocation
- **System Uptime**: Platform availability percentage


## 🚀 Deployment

### Production Deployment

1. **Build the application**

```bash
npm run build
```

2. **Deploy to Vercel**

```bash
vercel --prod
```


### Environment Configuration

Ensure all production environment variables are set:

- Database connection strings
- API keys for AI services
- Authentication secrets
- Monitoring configurations


## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



---

**Team CodeLabs - IntelliHack 2025 | Making disaster response smarter, faster, and more effective**

<div style="text-align: center">⁂</div>

