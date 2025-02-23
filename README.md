# Next.js Application Setup Guide

## Prerequisites
Ensure you have the following installed on your machine:
- **Node.js v22** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

## Clone the Repository
```sh
git clone https://github.com/nehanya/Front-End.git
cd Front-End
```

## Install Dependencies
```sh
npm install
```

## Environment Variables
Create a `.env` file in the root directory and configure necessary environment variables:
```
NEXT_PUBLIC_API_URL=your_backend_url
JWT_SECRET=your_jwt_secret
SESSION_TIMEOUT=600 # 10 minutes in seconds
```

## Running the Application
```sh
npm run dev
```
The application will start at `http://localhost:3000/`.

## Features and Functionality

### 1. User Authentication
- Signup and login using JWT authentication.
- Tokens are securely stored and managed.

### 2. Event Participation
- Users can view a list of events they are participating in.

### 3. Task Management
- Users can create new tasks.
- Users can delete tasks they created.

### 4. Auto-Logout Mechanism
- If the user is idle for **10 minutes**, a popup appears with a **60-second countdown**.
- The popup provides two options:
  - **Stay Login:** Resets the timer to 10 minutes.
  - **Logout:** Logs out the user immediately.
- Any interaction within the countdown extends the session.

## Challenges and Solutions
### Challenge: Managing JWT Authentication and Auto-Logout
**Solution:** Used JWT tokens with expiry handling and implemented a session timeout mechanism.

### Challenge: Handling Session Timeout with UI Notification
**Solution:** Implemented a state-based timer that triggers a modal warning before logging out.

## Next Steps
- Enhance UI with better design.
- Add backend API integration for storing tasks and events.
- Implement role-based access control.

## Conclusion
This project provides a foundation for an event and task management system with authentication and session management. Feel free to extend its features as per requirements.

