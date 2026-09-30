# 🧭 FindMyBuddy

**FindMyBuddy** is a location-based platform designed to help users discover and connect with people around them based on their location and shared interests.

The project focuses on building a practical location-aware application with a modern frontend, backend APIs, user authentication, and interactive location-based features.

---

## ✨ Features

- 📍 **Location-Based Discovery**
  - Find users/buddies based on their location.
  - Display nearby users through an interactive interface.

- 👥 **Buddy Discovery**
  - Discover people based on proximity and relevant information.
  - Designed to make finding people with similar interests easier.

- 🔐 **User Authentication**
  - Secure user registration and login.
  - Authenticated user sessions.

- 🗺️ **Interactive Location Interface**
  - Location information is presented through an interactive map-based experience.
  - Users can explore nearby locations and buddies.

- 👤 **User Profiles**
  - Users can maintain profile information.
  - Profile information can be used to help others understand common interests.

- ⚡ **Full-Stack Application**
  - React frontend communicates with a Node.js/Express backend.
  - REST APIs handle application data and user operations.

- 📱 **Responsive UI**
  - Designed to work across desktop and mobile screen sizes.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Map / Location APIs

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- Secure authentication flow

### Deployment

- Vercel
- Render

---

## 🏗️ Architecture

```text id="7b8j3e"
                       ┌──────────────────────┐
                       │       Browser        │
                       │                      │
                       │    React Frontend    │
                       └──────────┬───────────┘
                                  │
                              HTTP / API
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │   Node.js + Express  │
                       │       Backend        │
                       │                      │
                       │ Authentication      │
                       │ User APIs            │
                       │ Location Logic       │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │       MongoDB        │
                       │                      │
                       │ Users                │
                       │ Profiles             │
                       │ Location Data        │
                       └──────────────────────┘
```

---

## 🔄 How It Works

### 1. User Authentication

A user creates an account or logs into an existing account.

```text id="9z8yqk"
User
 ↓
Login / Signup
 ↓
Backend API
 ↓
Authentication
 ↓
User Session
```

### 2. Location Access

After authentication, the application can obtain the user's location through the browser's location capabilities.

```text id="5jslfr"
Browser
   ↓
Geolocation
   ↓
Latitude + Longitude
   ↓
Backend
```

### 3. Buddy Discovery

The application uses location information to identify relevant nearby users.

```text id="a9n4yu"
Current User
     │
     ▼
Current Location
     │
     ▼
Nearby Users
     │
     ▼
Filter / Match
     │
     ▼
Potential Buddies
```

### 4. Display

Relevant users and location information are presented through the application's interface, allowing users to explore potential connections.

---

## 📍 Location-Based Architecture

A key part of FindMyBuddy is handling geographic information.

A simplified flow looks like:

```text id="5frqv9"
Latitude
   +
Longitude
   │
   ▼
Location Query
   │
   ▼
Distance / Proximity
   │
   ▼
Nearby Users
```

This provides the foundation for location-aware discovery.

---

## 🔐 Authentication

The application uses authenticated requests to protect user-specific functionality.

Typical flow:

```text id="4djh7x"
Login
  ↓
Credentials Verification
  ↓
Authentication Token
  ↓
Authenticated Requests
  ↓
Protected Resources
```

The backend validates the user's authentication before allowing access to protected functionality.

---

## 📂 Project Structure

```text id="x1k7np"
FindMyBuddy/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   └── package.json
│
└── README.md
```

> Update this structure to match the actual repository.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm
- MongoDB
- Git

### Clone the repository

```bash id="2kvjbr"
git clone https://github.com/htyagi5/FindMyBuddy.git

cd FindMyBuddy
```

### Install dependencies

Frontend:

```bash id="r1i7zq"
cd client
npm install
```

Backend:

```bash id="7u6x6h"
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend.

Example:

```env id="q7u1cl"
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

If a map/location provider requires an API key, configure it through environment variables rather than committing the key to the repository.

**Never commit secrets or `.env` files to GitHub.**

---

## ▶️ Running Locally

### Start the backend

```bash id="3r0rpo"
cd server
npm run dev
```

### Start the frontend

```bash id="xq3w3v"
cd client
npm run dev
```

Open the frontend development URL in your browser.

---

## 🌍 Deployment

The application can be deployed using a separated frontend/backend architecture:

```text id="1e4m8c"
                  FindMyBuddy
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Vercel              Render
        Frontend              Backend
                                 │
                                 ▼
                              MongoDB
```

---

## 🧠 Engineering Concepts

FindMyBuddy provided practical experience with several concepts:

- Location-aware application design
- Browser geolocation APIs
- REST API development
- React frontend development
- Node.js and Express.js
- MongoDB data modeling
- Authentication and authorization
- Frontend/backend integration
- Handling geographic coordinates
- Responsive UI development
- Production deployment

---

## 📚 What I Learned

Building FindMyBuddy helped me understand how to combine a traditional full-stack application with location-based functionality.

Key areas included:

- Building React applications
- Designing Express APIs
- MongoDB and Mongoose
- Authentication
- Working with latitude and longitude
- Location-based filtering
- Integrating external APIs
- Managing environment variables
- Connecting frontend and backend services
- Deploying full-stack applications

---

## 🔮 Future Improvements

Possible improvements include:

- 📍 More accurate distance-based matching
- 🧑‍🤝‍🧑 Interest-based buddy recommendations
- 💬 Real-time messaging
- 🔔 Notifications
- 🗺️ Improved map interactions
- 🟢 Online/offline presence
- 🔒 More granular location privacy controls
- 📱 Improved mobile experience
- 👥 Group discovery
- ⭐ Buddy rating/reputation system

---

## 👨‍💻 Author

**Harshit Tyagi**

Computer Science & Engineering @ AKGEC

Interested in:

- Backend Development
- Full-Stack Development
- Real-Time Applications
- Location-Based Systems
- Cloud Technologies
- GenAI

GitHub: **@htyagi5**

---

## ⭐ Support

If you find FindMyBuddy interesting, consider giving the repository a ⭐.

Built as a practical full-stack project exploring location-aware applications, authentication, APIs, and user discovery.
