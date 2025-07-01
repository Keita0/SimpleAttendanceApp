# SimpleAttendanceApp

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Frontend     | React, Tailwind CSS, Axios     |
| Backend      | Node.js, Express, Multer, JWT  |
| Database     | MySQL                          |
| Auth         | JSON Web Tokens (JWT)          |
| File Uploads | Multer (for attendance photos) |

## Installation Guide

### 1. Clone the Project

```bash
git clone https://github.com/your-username/employee-attendance.git
cd employee-attendance
```
### 2. Back End Setup
```
cd backend
npm install
touch .env
nano .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=attendance_db
JWT_SECRET=your_jwt_secret
(control+x)
npm run dev
```
### 3. Frontend Setup (React)
```
cd frontend
npm install
npm start
```


## Database
```
-- Database: attendance_db

-- Table structure for `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','employee') DEFAULT 'employee',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for `attendance`
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `timestamp` datetime NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```
