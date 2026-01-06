# 📚 LearnCraft - Backend API

> This is the server-side application for **LearnCraft**, a smart study habit analyzer and scheduler. Built with Node.js, Express, and TypeScript, it handles user authentication, subject management, and powers the **AI-driven study schedule generator** using Google Gemini.

## 🚀 Live Demo
- **Backend URL:** [Link to your Render/Railway Deployment]
- **Frontend Repository:** [[[Link to your Frontend GitHub Repo](https://github.com/Binu0714/LearnCraft_FE](https://github.com/Binu0714/LearnCraft---FrontEnd.git))]

---

## 🛠️ Technologies & Tools Used

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** Passport.js (Google Strategy) & JSON Web Tokens (JWT)
*   **AI Integration:** Google Generative AI (Gemini)
*   **Security:** CORS, Protected Routes (Middleware)

---

## ✨ Key Features

*   **🔐 Secure Authentication:**
    *   User Registration & Login.
    *   **Passport.js** integration for secure session handling.
    *   **JWT Strategies** for protecting API endpoints.
    *   Password management and reset capabilities.

*   **📚 Subject & Priority Management:**
    *   **CRUD Operations:** Users can add, edit, and delete study subjects.
    *   **Priority System:** Custom controller to handle subject priority levels (1-5), essential for the scheduling algorithm.

*   **📅 Routine & Schedule Logic:**
    *   **Routine Tracking:** Manage fixed daily habits (Sleep, Lunch, Gym) to avoid scheduling conflicts.
    *   **AI Scheduler:** Dedicated endpoint that aggregates subjects, priorities, and routines to generate an optimized timetable via **Gemini AI**.
    *   **Statistics:** specific endpoints to calculate total study hours and active subject counts.

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` file in the root directory.

| Variable | Description |
| :--- | :--- |
| `SERVER_PORT` | Port number (e.g., 5000) |
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret key for signing tokens |
| `GOOGLE_CLIENT_ID` | Google Console Client ID (for Passport) |
| `GOOGLE_CLIENT_SECRET` | Google Console Client Secret (for Passport) |
| `GEMINI_API_KEY` | API Key from Google AI Studio |

---

## 💻 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Binu0714/LearnCraft_BE.git
    cd LearnCraft_BE
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    *   Create a `.env` file in the root directory.
    *   Copy the variables from the table above and fill in your keys.

4.  **Run the Server**
    *   **Development Mode:**
        ```bash
        npm run dev
        ```
    *   **Production Build:**
        ```bash
        npm run build
        npm start
        ```
    *   *Server runs on `http://localhost:5000` by default.*

---

## 📂 Project Structure

```bash
src/
├── config/         # Configuration files (Passport.js strategies)
├── controllers/    # Business logic for API endpoints
│   ├── auth.controller.ts
│   ├── password.controller.ts
│   ├── routine.controller.ts
│   ├── schedule.controller.ts
│   ├── subject.controller.ts
│   └── SubjectPriority.controller.ts
├── middleware/     # Auth verification middleware (auth.ts)
├── models/         # Mongoose Schemas (User, Routine, Schedule, Subject)
├── routes/         # API Route definitions
│   ├── auth.routes.ts
│   ├── priority.routes.ts
│   ├── routine.routes.ts
│   ├── schedule.routes.ts
│   └── subject.routes.ts
├── utils/          # Helpers (Token generation, etc.)
└── index.ts        # Application entry point
````

## 🔗 API Endpoints Overview

### Auth
*   `POST /api/v1/auth/register` - Register New User
*   `POST /api/v1/auth/login` - User Login
*   `GET /api/v1/auth/google` - Initiate Google OAuth Login
*   `GET /api/v1/auth/me` - Get Current User Details
*   `PUT /api/v1/auth/me` - Update User Profile (Username/Email)
*   `POST /api/v1/auth/forgot-password` - Send Password Reset Link
*   `POST /api/v1/auth/reset-password` - Reset Password with Token

### Subjects
*   `GET /api/v1/subjects` - Fetch All User Subjects
*   `POST /api/v1/subjects` - Create New Subject
*   `PUT /api/v1/subjects/:id` - Update Subject Details
*   `DELETE /api/v1/subjects/:id` - Remove Subject

### Priorities
*   `GET /api/v1/priorities` - Get Priority Levels for Subjects
*   `POST /api/v1/priorities` - Set/Update Subject Priority (1-5)

### Routines
*   `GET /api/v1/routines` - Fetch Daily Routines (Sleep, Lunch, etc.)
*   `POST /api/v1/routines` - Add New Routine
*   `DELETE /api/v1/routines/:id` - Delete Routine

### Schedules (AI Powered)
*   `POST /api/v1/schedules/generate` - **AI Endpoint:** Generate Timetable via Gemini
*   `POST /api/v1/schedules` - Save Generated Schedule to Database
*   `GET /api/v1/schedules/stats` - Fetch Dashboard Analytics (Total Hours)

👨‍💻 Author
Binu Jinajith - [GitHub Profile](https://github.com/Binu0714)
