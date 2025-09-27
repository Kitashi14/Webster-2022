# Webster-2022 Backend

A Node.js/Express backend API for the Webster complaint and worker management system.

## Features

- **Authentication & Authorization**: JWT-based auth with Google OAuth integration
- **User Management**: Complete user registration, profile management
- **Complaint System**: Create, manage, and track complaints
- **Worker Management**: Worker profiles and job acceptance
- **Real-time Chat**: Socket.io integration for real-time communication
- **Security**: Helmet, rate limiting, input validation
- **Logging**: Winston-based structured logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.io
- **Validation**: Joi
- **Security**: Helmet, express-rate-limit
- **Logging**: Winston
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account for email services

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your credentials

5. Start development server:
   ```bash
   npm run dev
   ```

### Environment Variables

See `.env.example` for all required environment variables.

Key variables:

- `JWT_SECRET`: Strong secret for JWT tokens (minimum 32 characters)
- `DATABASE_USERNAME` & `DATABASE_PASSWORD`: MongoDB credentials
- `EMAIL_NODEMAILER` & `PASSWORD_NODEMAILER`: Gmail credentials

### API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth

#### Users

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

#### Complaints

- `GET /api/complain` - Get complaints
- `POST /api/complain` - Create complaint
- `PUT /api/complain/:id` - Update complaint

#### Workers

- `GET /api/worker` - Get workers
- `POST /api/worker` - Register as worker

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
backend/
├── controllers/          # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose models
├── routers/            # Express routes
├── utils/              # Utility functions
├── logs/               # Application logs
└── server.js           # Application entry point
```

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent spam requests
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for secure passwords
- **CORS**: Configured for frontend origin only

## Logging

The application uses Winston for structured logging:

- Development: Console output with colors
- Production: File-based logging (error.log, combined.log)

## Error Handling

Centralized error handling with:

- Proper HTTP status codes
- Structured error responses
- Development vs production error details
- Mongoose error parsing

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Test your changes thoroughly
