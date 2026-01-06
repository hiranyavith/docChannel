
---


# 🛠️ Appointment Booking System - Backend

A robust **Node.js** and **Express.js** backend for the **Appointment Booking System**, featuring secure **JWT authentication**, **role-based access control**, and **MySQL** integration. It handles user management, appointment scheduling, and real-time email notifications.

---

## 🚀 **Features**

- 🔐 **JWT Authentication:** Secure sign-up, login, and role-based authorization.
- 🧑‍💼 **Role Management:** Supports **User** and **Admin** roles with different access levels.
- 📅 **Appointment APIs:** Book, view, and cancel appointments with time-slot validation.
- 🏷️ **User Management:** CRUD operations for user profiles, including secure password handling.
- 📧 **Email Notifications:** Registration, booking confirmation, and password reset emails via **Nodemailer**.
- 🕓 **Slot Management:** Admin can manage (add/delete) time slots dynamically.
- 🌐 **CORS & Security:** CORS-enabled and secure route handling.

---

## 🏗️ **Tech Stack**

- **Server:** Node.js, Express.js  
- **Database:** MySQL  
- **Authentication:** JWT, bcryptjs  
- **Email:** Nodemailer  
- **Validation:** express-validator  
- **ORM:** Sequelize (or raw MySQL queries if preferred)  
- **Environment Management:** dotenv

---

## 💻 **Getting Started**

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/your-username/appointment-booking-backend.git
cd appointment-booking-backend
```

2️⃣ Install Dependencies
```bash
npm install
```
3️⃣ Configure Environment Variables
Create a .env file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=appointment_booking
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.your-email.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password #google app password
```

4️⃣ Set Up the Database


```sql
CREATE DATABASE appointment_booking;

USE appointment_booking;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    address VARCHAR(255),
    telephone VARCHAR(15),
    role ENUM('user', 'admin') DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Completed', 'Canceled', 'Paid' , 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    time_slot VARCHAR(50) NOT NULL
);

```

5️⃣ Run the Server
```bash

npm run dev

```

Server runs at: http://localhost:5000

🧪 API Endpoints
🔒 Auth Routes
POST /api/auth/register - Register new user
POST /api/auth/login - Login and get JWT token
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password - Reset password with token

👤 User Routes
GET /api/users/me - Get current user profile
PUT /api/users/me - Update current user profile
GET /api/users - Admin: Get all users
PUT /api/users/:id - Admin: Update user details
DELETE /api/users/:id - Admin: Delete user

📅 Appointment Routes
GET /api/appointments - Get user appointments
POST /api/appointments - Book appointment
DELETE /api/appointments/:id - Cancel appointment

⏰ Slot Management (Admin)
GET /api/slots - Get available slots
POST /api/slots - Add new slot
DELETE /api/slots/:id - Delete slot

📜 Project Structure
```bash

/src
  ├── controllers/        # Route handlers
  ├── models/             # Sequelize models (Users, Appointments, Slots)
  ├── routes/             # API route definitions
  ├── middleware/         # JWT auth, role-checking, and validation
  └── utils/              # Helper functions (email sender, validators)
server.js                 # Entry point

```

🛡️ Security & Best Practices
Password hashing using bcryptjs.
JWT-based authentication with token expiration.
Role-based middleware for protected routes.
Sanitized input validations with express-validator.
🎉 Deployment
⚡ Deploy with Render/Vercel
Deploy MySQL database on a cloud provider.
Update environment variables accordingly.
Deploy frontend and backend (Render for backend, Vercel for frontend).
❤️ Contributing
We welcome all contributions!

Fork the repository.
Create a feature branch: git checkout -b feature/my-feature.
Submit a pull request.




📞 Contact
💻 GitHub: HTsandaruvan
🌐 Portfolio: https://harsha-portfolio-rho.vercel.app/
📧 Email: tsandaruvan29@gmail.com

---

### 🎯 **Key Highlights of Both READMEs:**
- Clear **project descriptions** and **tech stacks**.  
- 💾 **Step-by-step installation and setup guides** for both frontend and backend.  
- 🔐 **API documentation** for backend routes.  
- 🎨 **UI and UX highlights** for frontend.  
- 🧩 **Project structures** for easy navigation.  
- ❤️ **Contributing guidelines** 
