# Full-Stack Event Management Application

## 🔥 Project Overview

This project is a Full-Stack Event Management Web Application developed as part of an internship submission.  

It demonstrates complete implementation of:

- Backend API development
- Frontend UI integration
- Database connectivity
- Google OAuth Authentication
- Production deployment

The application is fully deployed and running on Render with a single integrated deployment (Frontend + Backend + OAuth).

---

## 🌐 Live Application

Production URL:

https://event-app-ilov.onrender.com

---

# 🏗️ Project Architecture

This application follows a full-stack architecture:

Frontend (React)  
⬇  
Backend (Node.js + Express)  
⬇  
PostgreSQL Database  
⬇  
Google OAuth 2.0 Authentication  

All components are deployed together under one service.

---

# 📌 Phase 1 – Backend Development

### Technologies Used:
- Node.js
- Express.js
- PostgreSQL (via pg)
- Express Session
- REST APIs

### Key Features:
- PostgreSQL database connection
- Automatic users table creation
- REST API endpoints
- Session management
- Production-ready configuration

### API Endpoints:
- `/api/user` – Get logged-in user
- `/auth/google` – Initiate Google login
- `/auth/google/callback` – OAuth callback
- `/logout` – Logout user

---

# 📌 Phase 2 – Frontend Development

### Technologies Used:
- React.js
- Fetch API
- CSS

### Key Features:
- Clean responsive UI
- Google Login button
- User authentication display
- Logout functionality
- API integration with backend

The frontend is built using React and served by Express in production.

---

# 📌 Phase 3 – Google OAuth Integration

### Technologies Used:
- Passport.js
- passport-google-oauth20
- Express Session

### Authentication Flow:
1. User clicks "Login with Google"
2. Redirects to Google authentication
3. Google verifies user
4. Redirects back to application
5. User details stored in PostgreSQL
6. Session maintained securely

OAuth works in production using HTTPS and secure cookies.

---

# 🗄️ Database Design

### Users Table

| Column | Type | Description |
|--------------|----------|----------------------------|
| id | SERIAL | Primary Key |
| google_id | TEXT | Unique Google ID |
| display_name | TEXT | User Name |
| email | TEXT | User Email Address |

The table is automatically created when the server starts.

---

# 🚀 Deployment Details

### Platform:
Render (Single Service Deployment)

### Deployment Strategy:
- Frontend build created during deployment
- Express serves React static build
- PostgreSQL hosted via Render Database
- Environment variables configured securely

### Environment Variables:
- DATABASE_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- SESSION_SECRET

---

# 🔐 Security Implementation

- HTTPS enabled (Render SSL)
- Secure session cookies
- Environment-based configuration
- OAuth token handling via Passport
- SQL parameterized queries

---

# 📂 Project Structure
root/ │ ├── server.js ├── package.json ├── frontend/ │ ├── src/ │ ├── public/ │ └── package.json ├── models/ ├── routes/ └── README.md


---

# 🎯 Key Learning Outcomes

- Full-stack application architecture
- Production deployment strategy
- OAuth 2.0 authentication integration
- Secure session handling
- PostgreSQL integration with Node.js
- Debugging and deployment troubleshooting

---

# 👨‍💻 Developed By

Shashank Shukla  
Full-Stack Development Internship Project  

---

# ✅ Final Status

✔ Backend fully functional  
✔ Frontend integrated  
✔ Google OAuth working  
✔ PostgreSQL connected  
✔ Deployed successfully  
✔ Production ready  

---

# 🏁 Conclusion

This project successfully demonstrates end-to-end full-stack development including backend APIs, frontend integration, database management, authentication, and cloud deployment under a single production URL.
