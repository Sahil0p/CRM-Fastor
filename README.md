# 🚀 CRM Backend – Node.js, Express, MongoDB, JWT

This is a CRM backend system where company employees/counsellors can manage student enquiries (leads).  

### ✅ Features
- Employee registration & login (JWT auth)
- Public lead creation form (no login required)
- View unclaimed leads
- Claim a lead (assign to logged-in user)
- View leads claimed by logged-in user
- MongoDB + Express + JWT secure API

---

## 📂 Folder Structure

```
crm-api/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── Employee.js
    │   └── Lead.js
    ├── middleware/
    │   └── auth.js
    ├── controllers/
    │   ├── auth.controller.js
    │   └── lead.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   └── lead.routes.js
    ├── utils/
    │   ├── asyncHandler.js
    │   ├── ApiError.js
    │   └── ApiResponse.js
    └── validations/
        ├── auth.validation.js
        └── lead.validation.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in your root directory:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/crm_api
JWT_SECRET=supersecretjwtkeychange
JWT_EXPIRES_IN=7d
NODE_ENV=development

```


## 🧠 Installation & Setup

```bash
# 1️⃣ Clone the repo
git clone https://github.com/yourusername/crm-backend.git
cd crm-backend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Add environment variables
# (see .env example above)

# 4️⃣ Start the server
npm start
```

Server will run at:  
👉 `http://localhost:4000`

---

## 🔑 Authentication Guide

After login, you'll receive a token like:
```
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
### ✅ Important: How to use the token in Postman

> **Important:** After login, copy the token and paste it in Postman:
> 
> **Authorization → Type: Bearer Token → Token field**
> 
> Then test protected APIs like unclaimed leads, claim lead, and my leads.

---

## 📌 API Endpoints Overview
### 🧍 Employee Authentication
| Method | Endpoint             | Description                | Auth |
| ------ | -------------------- | -------------------------- | ---- |
| POST   | `/api/auth/register` | Register a new employee    | ❌ No |
| POST   | `/api/auth/login`    | Login employee & get token | ❌ No |

### 📝 Lead Management

| Method | Endpoint               | Description                               | Auth           |
| ------ | ---------------------- | ----------------------------------------- | -------------- |
| POST   | `/api/leads`           | Submit enquiry (public form)              | ❌ No           |
| GET    | `/api/leads/unclaimed` | Fetch all unclaimed leads                 | ✅ Bearer Token |
| PATCH  | `/api/leads/:id/claim` | Claim a specific lead                     | ✅ Bearer Token |
| GET    | `/api/leads/my`        | Fetch leads claimed by logged-in employee | ✅ Bearer Token |

### 🔧 System Utility
| Method | Endpoint  | Purpose                  |
| ------ | --------- | ------------------------ |
| GET    | `/`       | Welcome / API info route |
| GET    | `/health` | Health check             |

### 🚀 Testing Sequence Flow
| Step | Action                      | Endpoint                     |
| ---- | --------------------------- | ---------------------------- |
| 1️⃣  | Register                    | `POST /api/auth/register`    |
| 2️⃣  | Login & copy token          | `POST /api/auth/login`       |
| 3️⃣  | Submit a lead (public user) | `POST /api/leads`            |
| 4️⃣  | View unclaimed leads        | `GET /api/leads/unclaimed`   |
| 5️⃣  | Claim a lead                | `PATCH /api/leads/:id/claim` |
| 6️⃣  | Get your claimed leads      | `GET /api/leads/my`          |

 ---

 ## 🧪 Postman Testing
### Register Employee
```
POST http://localhost:4000/api/auth/register
Body:
{
  "name":"Test User",
  "email":"test@crm.com",
  "password":"pass1234"
}
```

### Login
```
POST http://localhost:4000/api/auth/login
```
> Copy the token from response

### Submit Lead (no auth)
```
POST http://localhost:4000/api/leads
```
### Set Auth Header for next APIs
```
Authorization: Bearer <your_token>
```
### Get Unclaimed Leads
```
GET http://localhost:4000/api/leads/unclaimed
```
### Claim Lead
```
PATCH http://localhost:4000/api/leads/<leadId>/claim
```
### Get My Leads
```
GET http://localhost:4000/api/leads/my
```


