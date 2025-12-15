# CP Portal – Backend
Backend service for the **CP Portal** providing authentication, user management, and access control for internal and external users.  
Built with **Node.js, Express, PostgreSQL, and Sequelize**
---
## 🚀 Features
### Authentication
- Unified `/auth/login` API
- **Internal users**: Active Directory (LDAP) authentication (2-step UX)
- **External users**: Email OTP / Phone OTP authentication
- JWT-based access tokens
- Refresh token lifecycle (create, verify, invalidate)
- Secure logout using refresh token invalidation
### User Management
- Create / Read / Update / Delete (soft delete) users
- Role assignment
- Access rights mapping (many-to-many)
- Corporate association
- Authentication type configuration (Email / Phone / AD)
- Internal vs External user handling
---
## 🛠 Tech Stack
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize ORM**
- **JWT** for authentication
- **LDAP (Active Directory)** for internal authentication
- **Nodemailer** (Email OTP – SMTP configurable)
- **Crypto** for secure token generation
---
## 🔐 Authentication Flow
### Internal Users (Active Directory)
1. User enters email
2. Backend identifies user as **INTERNAL**
3. Frontend prompts for password
4. Backend authenticates against **AD (LDAP)**
5. JWT + Refresh Token issued on success
### External Users (OTP)
1. User enters email or phone
2. Backend sends OTP (Email / Phone)
3. User verifies OTP
4. JWT + Refresh Token issued on success
---
## 📡 API Overview
### Authentication
- `POST /auth/login`
- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `POST /auth/logout`
### Users
- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
---
## ⚙️ Environment Variables
Create a `.env` file in the root directory and store all the credentials requried for the project.

## Getting Started

Install Dependencies
- npm install

Run database migrations / sync
- npm run dev

Start Server
- npm start

Server will start on:
http://localhost:4000

- Use postman for API Testing


