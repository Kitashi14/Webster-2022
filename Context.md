# Prompt:
Give short answers until asked otherwise and give code snippets with comments rather than explanations , for big tasks first give plan of action by giving bullet points and then after asking go point by point so as to not overwehlm with information

# Project: Complaint Box

A web application that allows users to raise complaints, which are then assigned to and resolved by workers. An admin role is responsible for approving and assigning workers to complaints.

## Technology Stack

### Backend

*   **Runtime**: Node.js
*   **Framework**: Express
*   **Database**: MongoDB with Mongoose
*   **Real-time Communication**: Socket.IO
*   **Authentication**: JWT, bcryptjs
*   **Other**: Nodemailer, dotenv

### Frontend

*   **Framework**: React
*   **Routing**: React Router
*   **Mapping**: Leaflet
*   **Styling**: Tailwind CSS
*   **Real-time Communication**: Socket.IO Client
*   **Other**: Firebase (for Google Auth), react-toastify

## Project Structure

```
.
├── backend
│   ├── controllers
│   ├── models
│   ├── routers
│   ├── server.js
│   └── socket.js
└── frontend
    ├── src
    │   ├── Components
    │   ├── context
    │   ├── Helper
    │   ├── Pages
    │   ├── socket
    │   └── App.js
    └── public
```

## Database Schema

The database consists of the following main collections:

*   **users**: Stores user information.
*   **workers**: Stores worker information.
*   **complains**: Stores complaint details.
*   **tokens**: Used for OTP and email verification.
*   **notifications**: Stores notifications for users and workers.
*   **chats**: Stores chat messages.

For a detailed schema, refer to `db structure.txt`.

## Key API Endpoints

### Authentication (`/api/auth`)

*   `GET /googleAuthlink`, `GET /googleAuth`: Handle Google authentication.
*   `GET /authLogin`: Verify access token.
*   `POST /getOtp`, `POST /verifyOtp`: Handle OTP verification.
*   `POST /login`: Standard user login.

### Complains (`/api/complain`)

*   `POST /add`, `POST /update`, `DELETE /:cid`: Manage complaints.
*   `GET /username/:uid`, `GET /getDetails/:cid`: Fetch complaint data.

### Users (`/api/user`)

*   `POST /createAccount`, `PATCH /updateUser`: Manage user accounts.
*   `PATCH /favorite/:username/:id`, `DELETE /favorite/:username/:id`: Manage favorite workers.

### Workers (`/api/worker`)

*   `POST /add`, `DELETE /delete/:workerUsername/:profession`: Manage workers.
*   `GET /getDetails/:uid/:profession`, `GET /filter/:profession`: Fetch worker data.

## Frontend Architecture

*   **`Pages`**: Top-level components for each route (e.g., `HomePage`, `ChatPage`).
*   **`Components`**: Reusable UI elements (e.g., `Navbar`, `ComplainBox`).
*   **`Context`**: State management for authentication (`AuthContext`) and chat (`ChatContext`).

## Real-time Chat (Socket.IO)

The chat system is built on a set of Socket.IO events for real-time communication.

### Server-side Events (`backend/socket.js`)

*   **`connection`**: A new client connects.
*   **`joined`**: A user joins the chat; the server sends back initial data (online users, chat history) and broadcasts the new user's presence.
*   **`send message`**: A user sends a message; the server saves it to the database and forwards it to the recipient.
*   **`seen`**: A user has seen a message; the server updates the message status and notifies the sender.
*   **`typing`**: A user is typing; the server forwards this status to the other user in the chat.
*   **`disconnect`**: A user disconnects; the server broadcasts that the user has left.

### Client-side Events (`frontend/src/socket/socket.js`)

*   The client listens for events like `joined`, `left`, `new message`, `seen`, and `typing` to update the UI in real-time.
*   The client emits events like `joined`, `send message`, `seen`, and `typing` to interact with the server.

## Key Workflows

### Admin and Worker Assignment

*   **Admin Role**: There is no explicit `isAdmin` flag in the user model. Admin functionality is handled by a set of controller functions (`approveComplain`, `rejectComplain`, `closeComplain`) that are not yet exposed via API routes. An admin would need to be implemented, likely by adding a role to the user model and protecting these routes.
*   **Worker Task Assignment**:
    1.  A worker expresses interest in a task by calling the `acceptComplain` endpoint, which adds them to the `acceptedWorkers` list for that complaint.
    2.  An admin reviews the list of interested workers and assigns one by calling the `approveComplain` endpoint.
    3.  This updates the complaint's status to "assigned" and sets the `workerUsername`.

## Configuration

The project uses a `.env` file in the `backend` directory to store sensitive information like the database connection string and JWT secret.
