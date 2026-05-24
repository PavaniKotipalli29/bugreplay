# 🐞 BugReplay

BugReplay is a full-stack bug tracking system built using React, Node.js, Express, and MySQL.

It allows teams to report, manage, assign, and resolve bugs efficiently with role-based access, analytics, comments, screenshots, and activity tracking.

---

# 🚀 Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-Based Access

## Bug Management
- Create Bug Reports
- Edit Bugs
- Delete Bugs
- Assign Bugs to Users
- Update Bug Status
- Update Bug Priority
- Bug Filtering

## Collaboration
- Comment System
- Activity Timeline
- Step Reproduction Tracking
- Screenshot Uploads

## Dashboard
- My Workspace
- Assigned Bugs
- Reported Bugs
- Recently Updated Bugs

## Analytics
- Total Bugs
- Open Bugs
- In Progress Bugs
- Resolved Bugs
- Severity Statistics

## UI Features
- Dark/Light Theme
- Responsive Design
- Modern Glassmorphism UI
- Public Shareable Bug Links

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- CSS3

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Authentication
- JWT
- bcryptjs

## File Upload
- Multer

---

# 📂 Project Structure

```bash
BugReplay/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│
├── server/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── db/
│   └── server.js

Frontend Setup:
cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173

Backend Setup:
cd server
npm install
npm start

Backend runs on:

http://localhost:5000
Database Setup
Create MySQL database:
CREATE DATABASE bugreplay;
Import schema.sql file.
Update database credentials inside:
server/db.js