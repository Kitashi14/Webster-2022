# Webster-2022: Empowering Communities, Resolving Concerns

Welcome to [Compalint Box](https://github.com/Kitashi14/Webster-2022) –
where technology meets community engagement! Our team is dedicated to building a robust platform that facilitates seamless communication and issue resolution within your community.
## Team Name 0Π
## Team Members

- Sudhir Shukla
- Rishav Raj
- Ritik Vaidyasen

## Features

### 1. User-Friendly Interface
   - Intuitive user login/signup for hassle-free onboarding.
   - Varied user profiles catering to residents, electricians, and more.

### 2. Effortless Complaint Management
   - Standard & Custom Complaints tailored to diverse needs.
   - Add, delete, and update complaints with ease.

### 3. Dynamic Professional Profiles
   - Users can add multiple professions to showcase their diverse skills.
   - Professionals can selectively choose the complaints they want to address.

### 4. Transparent Resolution Ratings
   - Rate and review the resolution of complaints to maintain transparency.
   - Feedback-driven improvement for continuous enhancement.

### 5. Real-time Communication
   - Inbuilt chat feature for seamless communication anytime, anywhere.
   - Foster a sense of community through direct interaction.

### 6. Location Awareness
   - Integrated map functionality for easy location sharing.
   - Enhance accessibility and streamline service provision.

## Tech Stack

- **Backend:** NODE.js, ExpressJS, MongoDB
- **Frontend:** ReactJS, HTML, CSS (Tailwind), JavaScript

## 🚀 Deployment

Ready to deploy? We've got you covered!

### Quick Deploy (Recommended)
```bash
./deploy.sh
```
This interactive script guides you through the entire deployment process.

### Manual Deployment
- **Start here**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Fast track deployment guide
- **Detailed guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive documentation
- **Ready to go**: [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md) - Final checklist

### Deployment Architecture
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway (Free $5 credit/month)
- **Database**: MongoDB Atlas (Free tier)

**Total Cost**: FREE for moderate usage! 🎉

## Get Started (Local Development)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kitashi14/Webster-2022.git
   cd Webster-2022
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create .env file and add your credentials
   npm start
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the app**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:4000

### Environment Variables

Create `.env` files based on the examples:
- `backend/.env` - Backend configuration (database, OAuth, etc.)
- `frontend/.env.development` - Frontend development configuration

See `.env.example` files for required variables.

## Contribution Guidelines

We welcome contributions from the community! Check out our [contribution guidelines](CONTRIBUTING.md) to get started.


