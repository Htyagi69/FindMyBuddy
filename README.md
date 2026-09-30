# 🧭 FindMyBuddy

**FindMyBuddy** is a location-based platform that helps users discover and connect with people around them.

The application combines a traditional full-stack architecture with **Firebase real-time location synchronization**, allowing users' location updates to be reflected dynamically without repeatedly polling the backend.

---

## ✨ Features

- 📍 **Real-Time Location Tracking**
  - Tracks the user's current location.
  - Location changes are synchronized in real time using Firebase.
  - Other users can receive updated location information without manually refreshing the page.

- 🔥 **Firebase Realtime Updates**
  - Firebase is used specifically for real-time location synchronization.
  - Location changes are pushed to connected clients as they occur.

- 👥 **Buddy Discovery**
  - Discover users based on their current location.
  - Find potential buddies in the surrounding area.

- 🗺️ **Interactive Location Interface**
  - Users and their locations can be visualized through the application's map interface.

- 🔐 **User Authentication**
  - Secure user registration and login.
  - Authenticated access to user-specific functionality.

- ⚡ **Full-Stack Architecture**
  - React frontend.
  - Node.js/Express backend.
  - MongoDB for persistent application data.
  - Firebase for real-time location updates.

- 📱 **Responsive Interface**
  - Designed to work across desktop and mobile devices.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Browser Geolocation API

### Backend

- Node.js
- Express.js
- REST APIs

### Databases

- MongoDB
- Mongoose

### Real-Time Communication

- **Firebase Realtime Database**

### Authentication

- JWT

### Location

- Browser Geolocation API
- Map / Location APIs

### Deployment

- Vercel
- Render
- Firebase

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │                      │
                         │    React Frontend    │
                         │                      │
                         │  Geolocation API     │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     │                             │
                     ▼                             ▼
           ┌─────────────────┐           ┌─────────────────────┐
           │  Node.js +      │           │ Firebase Realtime   │
           │    Express      │           │      Database       │
           │                 │           │                     │
           │ REST APIs       │           │ Live Location Data  │
           │ Auth            │           │ Real-Time Updates   │
           │ App Logic       │           └──────────┬──────────┘
           └────────┬────────┘                      │
                    │                               │
                    ▼                               │
           ┌─────────────────┐                      │
           │    MongoDB      │                      │
           │                 │                      │
           │ User Data       │                      │
           │ App Data        │                      │
           └─────────────────┘                      │
                                                    │
                              Real-Time Location ───┘
                                      │
                                      ▼
                              Other Connected
                                  Clients
```

---

## 🔄 How Real-Time Location Works

The main real-time functionality of FindMyBuddy is built around Firebase.

### 1. Get User Location

The browser's Geolocation API obtains the user's current coordinates.

```text
Browser
   │
   ▼
Geolocation API
   │
   ▼
Latitude + Longitude
```

### 2. Update Firebase

Whenever the user's location changes, the application updates the corresponding Firebase location data.

```text
User Movement
      │
      ▼
New Coordinates
      │
      ▼
Firebase Realtime Database
```

### 3. Listen for Changes

Other connected clients listen for changes to the relevant location data.

```text
                    Firebase
                       │
            Location Changed
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Client A     Client B     Client C
          │            │            │
          ▼            ▼            ▼
       Updated      Updated      Updated
       Location     Location     Location
```

This eliminates the need for every client to continuously poll the backend for the latest coordinates.

---

## ⚡ Why Firebase for Location?

The application separates **persistent application data** from **rapidly changing real-time location data**.

```text
MongoDB
   │
   └── Users
       Profiles
       Application Data

Firebase
   │
   └── Current Locations
       Real-Time Updates
       Location Presence
```

This allows each system to handle a different responsibility.

MongoDB remains the primary persistent database, while Firebase handles the frequently changing real-time location state.

---

## 📍 Location Flow

A simplified location flow is:

```text
              User
               │
               ▼
       Browser Geolocation
               │
               ▼
        Latitude/Longitude
               │
               ▼
       Firebase Realtime DB
               │
        Real-Time Listener
               │
       ┌───────┴────────┐
       ▼                ▼
   Nearby User A    Nearby User B
       │                │
       ▼                ▼
   Map Update       Map Update
```

---

## 🔐 Authentication Flow

FindMyBuddy uses authenticated users for accessing user-specific functionality.

```text
User
 │
 ▼
Login / Signup
 │
 ▼
Backend
 │
 ▼
Authentication
 │
 ▼
Authenticated User
 │
 ├──────────────► Application APIs
 │
 └──────────────► Real-Time Location
```

---

## 🗄️ Data Architecture

FindMyBuddy uses different technologies according to the type of data being handled.

| Technology | Responsibility |
|---|---|
| **MongoDB** | Persistent user/application data |
| **Firebase Realtime Database** | Live location updates |
| **Geolocation API** | Obtaining user's coordinates |
| **Node.js + Express** | Backend APIs and application logic |
| **React** | User interface |

This separation prevents frequently changing location information from unnecessarily going through the main REST API.

---

## 📂 Project Structure

```text
FindMyBuddy/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── firebase/
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

> Adjust this structure according to the actual repository.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm
- MongoDB
- Firebase project
- Git

### Clone the repository

```bash
git clone https://github.com/htyagi5/FindMyBuddy.git

cd FindMyBuddy
```

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

## 🔑 Environment Variables

Configure your backend and frontend environment variables.

Example backend:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Firebase configuration should also be provided through environment variables rather than committing credentials directly to the repository.

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

**Never commit private credentials or `.env` files to GitHub.**

---

## ▶️ Running Locally

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

Make sure MongoDB and Firebase are configured before running the application.

---

## 🌍 Deployment

FindMyBuddy follows a distributed architecture:

```text
                    FindMyBuddy
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
          Vercel                  Render
        Frontend                  Backend
                                     │
                         ┌───────────┴───────────┐
                         │                       │
                         ▼                       ▼
                      MongoDB                Firebase
                    Persistent Data        Real-Time Data
                                                │
                                                ▼
                                          Live Locations
```

---

## 🧠 Engineering Challenges

### Real-Time Location Synchronization

One of the main challenges was keeping location information updated across multiple clients without constantly polling the backend.

Firebase's real-time listeners provide a way to propagate location changes as soon as the underlying data changes.

### Separating Persistent and Real-Time Data

Instead of putting every location update through the primary backend/database, the application separates responsibilities:

```text
Stable Data
    ↓
MongoDB

Frequently Changing Data
    ↓
Firebase Realtime Database
```

### Browser Location Handling

The application needs to handle:

- Location permissions
- Latitude/longitude updates
- Location changes
- Connection state
- Updating the UI when coordinates change

---

## 📚 What I Learned

Building FindMyBuddy gave me practical experience with:

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Firebase Realtime Database
- Real-time data synchronization
- Browser Geolocation API
- Latitude/longitude handling
- Location-based application design
- REST API development
- Real-time event-driven architecture
- Frontend/backend integration
- Environment variables
- Cloud deployment

---

## 🔮 Future Improvements

Possible improvements include:

- 💬 Real-time messaging
- 🔔 Push notifications
- 👥 Interest-based buddy matching
- 📍 Better proximity-based search
- 🟢 Online/offline presence
- 🔒 More granular location privacy
- 🗺️ Improved map interactions
- 👨‍👩‍👧‍👦 Group discovery
- 📱 Dedicated mobile application
- ⚡ Better handling of intermittent network connectivity

---

## 👨‍💻 Author

**Harshit Tyagi**

Computer Science & Engineering @ AKGEC

Interested in:

- Backend Development
- Full-Stack Development
- Real-Time Systems
- Cloud Technologies
- Location-Based Applications
- GenAI

GitHub: **@htyagi5**

---

## ⭐ Support

If you find FindMyBuddy interesting, consider giving the repository a ⭐.

Built to explore full-stack development, real-time location synchronization, authentication, and location-aware applications.
