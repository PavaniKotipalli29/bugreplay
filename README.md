# 🐞 BugReplay

BugReplay is a full-stack bug tracking system built using React, Node.js, Express, and MySQL.

It allows teams to report, manage, assign, and resolve bugs efficiently with role-based access, analytics, comments, screenshots, and activity tracking.

---

# 🚀 Features

## Authentication & Authorization
- User Registration & Login
- JWT Authentication & Protected Routes
- Role-Based Access Control (Admin controls vs User permissions)

## Project Workspaces [NEW]
- Compartmentalize bugs under distinct Project scopes
- Create and organize project workspaces dynamically

## Advanced Bug Tracking & Filtering [NEW]
- Create, edit, and delete bug reports
- Advanced Dashboard filters for Project, Status, Severity, and Tags
- Custom sorting filters (Newest, Priority, Severity)
- Live hashtag preview chips for categories

## Collaboration & Markdown Engine [NEW]
- Interactive comment system
- Light/Dark themed markdown parsing for bug descriptions and comment blocks
- Fenced code blocks with single-click copy-to-clipboard action
- Activity log timelines and reproduction step tracking
- Multer screenshot file uploads

## Real-time Alert Notifications [NEW]
- Responsive Navbar notification bell drawer
- Automated unread counts and alerts when assigned a bug, or when comments/status change on your bugs
- Bulk clear actions to mark notifications as read

## SVG & CSS Interactive Analytics [NEW]
- Animated SVG circular progress completing percentages indicator
- Color-graded CSS progress bars tracking status breakdown (Open, In Progress, Resolved)
- CSS progress bars tracking severity distributions (High, Medium, Low)

## UI Features
- Seamless Navbar theme toggle switcher (Dark/Light Mode)
- Responsive glassmorphism cards and inputs
- Public shareable bug preview links

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