# Team Management & Capacity Planning - Backend API

> Production-ready Node.js/Express REST API for team management, capacity planning, PTO tracking, and Jira integration with AI-powered insights using Ollama.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Services](#services)
- [Authentication & Authorization](#authentication--authorization)
- [Metrics & Calculations](#metrics--calculations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This backend application provides a comprehensive API for managing software development teams, tracking their capacity, handling PTO requests, and integrating with Jira for real-time project insights. It features AI-powered analytics using Ollama for generating team performance summaries and predictions.

### Key Capabilities

- ✅ **User Authentication & Authorization** - JWT-based authentication with role-based access control
- ✅ **Team Management** - Create and manage teams with Jira integration
- ✅ **PTO Management** - Request, approve, and track paid time off with hour-based tracking
- ✅ **Holiday Management** - Company-wide and location-specific holidays with flexible hours support
- ✅ **Jira Integration** - Custom JQL queries stored in database (no YAML dependency)
- ✅ **Capacity Planning** - Calculate team capacity considering holidays, PTO, and workload
- ✅ **AI Insights** - Generate AI-powered team performance summaries using Ollama
- ✅ **Time Trends** - Analyze team and individual performance over time
- ✅ **Audit Logging** - Complete audit trail for compliance and security
- ✅ **Email Notifications** - Automated email alerts and scheduled reports

---

## ✨ Features

### Core Features

- **RESTful API Design** - Clean, intuitive endpoints following REST principles
- **MongoDB Database** - Flexible document storage with Mongoose ODM
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Role-Based Authorization** - Admin and Viewer roles with granular permissions
- **Input Validation** - Comprehensive validation using Joi schemas
- **Error Handling** - Centralized error handling with detailed error responses
- **Request Logging** - Complete request/response logging with Winston and Morgan
- **Security Middleware** - Helmet, CORS, rate limiting, and MongoDB sanitization
- **Pagination Support** - Built-in pagination for all list endpoints

### Business Features

- **Multi-Team Support** - Manage multiple teams with separate configurations
- **PTO Workflow** - Complete PTO request and approval workflow
- **Flexible Holiday Calendar** - Support for full-day and partial-day holidays with hours
- **JQL Query Management** - Store and manage Jira JQL queries per team in database
- **Time Trend Analysis** - Track individual and team performance metrics
- **Future Capacity Planning** - Calculate available bandwidth considering PTO and holidays
- **AI-Powered Insights** - Generate natural language summaries using Ollama LLM
- **HTML Report Generation** - Export insights as formatted HTML reports
- **Email Scheduling** - Schedule and send automated email reports
- **Comprehensive Audit Trail** - Track all system changes for compliance

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────────────────────────────────────────┐
│                                                      │
│              Express.js Backend API                  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │           Middleware Layer                   │  │
│  │  • Authentication (JWT)                      │  │
│  │  • Authorization (RBAC)                      │  │
│  │  • Validation (Joi)                          │  │
│  │  • Error Handling                            │  │
│  │  • Logging (Winston/Morgan)                  │  │
│  │  • Rate Limiting                             │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │           Route Layer                        │  │
│  │  /api/auth  /api/teams  /api/pto            │  │
│  │  /api/holidays  /api/time-trend              │  │
│  │  /api/teamwork-insights  /api/capacity       │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │        Controller Layer                      │  │
│  │  • Business Logic                            │  │
│  │  • Request Validation                        │  │
│  │  • Response Formatting                       │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │          Service Layer                       │  │
│  │  • JiraService                               │  │
│  │  • OllamaService (AI)                        │  │
│  │  • EmailService                              │  │
│  │  • DateService                               │  │
│  │  • CapacityCalculator                        │  │
│  │  • ReportGenerator                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │           Model Layer                        │  │
│  │  • User  • Team  • TeamMember                │  │
│  │  • Holiday  • PTO  • AuditLog                │  │
│  │  • JiraQuery  • EmailSchedule                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└──────────────────┬──────────────┬──────────────────┘
                   │              │
         ┌─────────▼────────┐    │
         │                  │    │
         │    MongoDB       │    │
         │   (Database)     │    │
         │                  │    │
         └──────────────────┘    │
                                 │
                    ┌────────────▼─────────────┐
                    │                          │
                    │  External Integrations   │
                    │                          │
                    │  • Jira Cloud API        │
                    │  • Ollama AI (Local)     │
                    │  • SMTP Email Server     │
                    │                          │
                    └──────────────────────────┘
```

### Data Flow

1. **Request Flow**: Client → Middleware → Routes → Controllers → Services → Database
2. **Response Flow**: Database → Services → Controllers → Response Formatting → Client
3. **External Integration**: Controllers → Services → External APIs (Jira/Ollama/Email)

---

## 🛠 Technology Stack

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express.js | 4.x | Web framework |
| **Database** | MongoDB | 6+ | Document database |
| **ODM** | Mongoose | 8.x | MongoDB object modeling |
| **Authentication** | JWT | 9.x | Token-based auth |
| **Validation** | Joi | 17.x | Schema validation |
| **Logging** | Winston | 3.x | Application logging |
| **HTTP Logging** | Morgan | 1.x | Request logging |
| **Email** | Nodemailer | 6.x | Email sending |
| **Date Handling** | date-fns | 3.x | Date manipulation |

### Security & Middleware

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Security Headers** | Helmet.js | HTTP security headers |
| **CORS** | cors | Cross-origin resource sharing |
| **Rate Limiting** | express-rate-limit | API rate limiting |
| **Input Sanitization** | express-mongo-sanitize | NoSQL injection prevention |
| **Password Hashing** | bcryptjs | Secure password hashing |

### External Integrations

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Jira Cloud API** | Issue tracking & project management | API token authentication |
| **Ollama** | AI-powered text generation (LLM) | Local installation or remote URL |
| **SMTP** | Email notifications | Standard SMTP credentials |

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── constants.js          # Application constants, enums, configurations
│   ├── database.js           # MongoDB connection setup & management
│   ├── email.js              # SMTP email configuration
│   ├── jira.js               # Jira API client configuration
│   └── ollama.js             # Ollama AI client configuration
│
├── models/
│   ├── User.js               # User authentication & profile model
│   ├── Team.js               # Team management model
│   ├── TeamMember.js         # Team membership relationships
│   ├── Holiday.js            # Company holidays with hours support
│   ├── PTO.js                # PTO/leave requests with approval workflow
│   ├── JiraQuery.js          # Team-specific JQL queries (replaces YAML)
│   ├── AuditLog.js           # System audit trail for compliance
│   └── EmailSchedule.js      # Email scheduling & delivery tracking
│
├── controllers/
│   ├── authController.js              # Authentication & user sessions
│   ├── teamsController.js             # Team CRUD operations
│   ├── usersController.js             # User management (admin)
│   ├── holidaysController.js          # Holiday calendar management
│   ├── ptoController.js               # PTO request & approval
│   ├── jiraQueryController.js         # JQL query management
│   ├── timeTrendController.js         # Time trend analytics
│   ├── teamworkInsightsController.js  # AI-powered insights
│   ├── futureCapacityController.js    # Capacity planning
│   ├── auditLogController.js          # Audit log queries (admin)
│   └── constantsController.js         # Frontend constants endpoint
│
├── routes/
│   ├── auth.js                   # Authentication routes
│   ├── teams.js                  # Team management routes
│   ├── users.js                  # User management routes (admin)
│   ├── holidays.js               # Holiday management routes
│   ├── pto.js                    # PTO request routes
│   ├── jiraQuery.js              # JQL query routes
│   ├── timeTrend.js              # Time trend analytics routes
│   ├── teamworkInsights.js       # AI insights routes
│   ├── futureCapacity.js         # Capacity planning routes
│   ├── auditLogs.js              # Audit log routes (admin)
│   └── constants.js              # Constants endpoint route
│
├── middleware/
│   ├── auth.js                   # JWT authentication middleware
│   ├── authorize.js              # Role-based authorization
│   ├── validation.js             # Request validation (Joi schemas)
│   ├── errorHandler.js           # Global error handler
│   └── logger.js                 # Request logging middleware
│
├── services/
│   ├── jiraService.js                  # Jira API integration
│   ├── ollamaService.js                # Ollama AI integration
│   ├── emailService.js                 # Email notifications
│   ├── dateService.js                  # Date & working hours calculations
│   ├── capacityCalculationService.js   # Capacity calculation engine
│   ├── capacityDataAggregator.js       # Capacity data aggregation
│   └── reportGenerator.js              # HTML/PDF report generation
│
├── utils/
│   ├── asyncHandler.js           # Async error wrapper
│   ├── helpers.js                # Utility helper functions
│   ├── validators.js             # Custom validators
│   └── logger.js                 # Winston logger configuration
│
├── scripts/
│   ├── seedData.js               # Database seeding script
│   └── migration/                # Database migration scripts
│
├── app.js                        # Express application setup
├── server.js                     # Server entry point
├── package.json                  # Dependencies & scripts
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

---

## 🗄️ Database Models

### 1. User Model

**Collection:** `users`

User authentication, profile, and role management.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | String | Yes | Unique email address (username) |
| `password` | String | Yes | Bcrypt hashed password |
| `firstName` | String | Yes | User's first name |
| `lastName` | String | Yes | User's last name |
| `role` | String | Yes | User role: `admin` or `viewer` |
| `teams` | Array[ObjectId] | No | References to Team model |
| `active` | Boolean | Yes | Account active status (default: true) |
| `lastLogin` | Date | No | Last login timestamp |
| `passwordChangedAt` | Date | No | Password change timestamp (for JWT invalidation) |
| `createdAt` | Date | Auto | Account creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Methods:**
- `comparePassword(candidatePassword)` - Compare plain password with hash
- `changedPasswordAfter(JWTTimestamp)` - Check if password changed after JWT issued
- `getSignedJwtToken()` - Generate JWT token

**Indexes:** `email` (unique)

---

### 2. Team Model

**Collection:** `teams`

Team configuration and membership management.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | String | Yes | Unique team identifier |
| `teamName` | String | Yes | Display name for team |
| `description` | String | No | Team description |
| `location` | String | Yes | Primary location: `US`, `India`, or `Global` |
| `members` | Array[ObjectId] | No | References to TeamMember model |
| `jiraProjectKey` | String | No | Jira project key (e.g., "PROJ") |
| `active` | Boolean | Yes | Team active status (default: true) |
| `createdBy` | ObjectId | No | Reference to User who created team |
| `createdAt` | Date | Auto | Team creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:** `teamId` (unique), `teamName`

---

### 3. TeamMember Model

**Collection:** `teammembers`

Relationship between users and teams with Jira account mapping.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | Yes | Reference to User model |
| `teamId` | ObjectId | Yes | Reference to Team model |
| `jiraAccountId` | String | Yes | Jira cloud account ID for API queries |
| `designation` | String | No | Job title/role in team |
| `joinDate` | Date | No | Date joined team |
| `active` | Boolean | Yes | Membership active status (default: true) |
| `createdAt` | Date | Auto | Record creation timestamp |

**Indexes:** Compound index on `(userId, teamId)` (unique)

---

### 4. Holiday Model

**Collection:** `holidays`

Company holidays with flexible hours support (full-day, half-day, custom hours).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `holidayName` | String | Yes | Name of the holiday (e.g., "New Year's Day") |
| `date` | Date | Yes | Date of the holiday |
| `location` | String | Yes | Location: `US`, `India`, or `Global` |
| `hours` | Number | Yes | Holiday hours (8 = full day, 4 = half day, etc.) |
| `description` | String | No | Additional details about the holiday |
| `recurring` | Boolean | No | Whether holiday repeats annually |
| `active` | Boolean | Yes | Holiday active status (default: true) |
| `createdBy` | ObjectId | No | Reference to User who created holiday |
| `createdAt` | Date | Auto | Record creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:** Compound index on `(date, location)`

**Notes:**
- Hours field allows flexible holiday definitions (full day, half day, custom)
- Used in capacity calculations to subtract from available working hours

---

### 5. PTO Model

**Collection:** `ptos`

Paid time off requests with approval workflow and hour tracking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | Yes | Reference to User model |
| `startDate` | Date | Yes | PTO start date |
| `endDate` | Date | Yes | PTO end date |
| `type` | String | Yes | PTO type: `vacation`, `sick`, `personal`, `other` |
| `status` | String | Yes | Status: `pending`, `approved`, `rejected` |
| `duration` | Number | Yes | Total PTO hours (calculated automatically) |
| `reason` | String | No | Reason for PTO request |
| `approvedBy` | ObjectId | No | Reference to User who approved (admin) |
| `approvedAt` | Date | No | Approval timestamp |
| `rejectionReason` | String | No | Reason for rejection (if applicable) |
| `notes` | String | No | Additional notes |
| `createdAt` | Date | Auto | Request creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:** `userId`, `status`, Compound index on `(startDate, endDate)`

**Notes:**
- Duration is calculated based on working days between start and end dates
- Used in capacity calculations to subtract from available hours

---

### 6. JiraQuery Model

**Collection:** `jiraqueries`

Team-specific Jira JQL queries stored in database (replaces teams.yaml).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | ObjectId | Yes | Reference to Team model |
| `jqlKey` | String | Yes | Query identifier: `hist_query`, `workinsights_query`, `future_capacity` |
| `jqlQuery` | String | Yes | Actual JQL query string |
| `description` | String | No | Description of what the query does |
| `active` | Boolean | Yes | Query active status (default: true) |
| `createdBy` | ObjectId | No | Reference to User who created query |
| `createdAt` | Date | Auto | Query creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:** Compound index on `(teamId, jqlKey)` (unique)

**Common JQL Keys:**
- `hist_query_associate` - Historical data for associate view
- `hist_query_team` - Historical data for team monthly view
- `hist_query` - General historical query for team view
- `workinsights_query` - Query for AI-powered insights
- `future_capacity` - Query for future capacity planning

**Example JQL:**
```sql
project = PROJ AND 
assignee in (account_id_1, account_id_2) AND 
created >= -30d AND 
status = Done
```

**Notes:**
- JQL queries are automatically built using team members' jiraAccountId
- Replaces the old teams.yaml configuration
- Supports dynamic assignee list based on team membership

---

### 7. AuditLog Model

**Collection:** `auditlogs`

Complete audit trail for compliance and security monitoring.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | No | Reference to User who performed action |
| `action` | String | Yes | Action type: `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `APPROVE`, `REJECT` |
| `resourceType` | String | Yes | Type of resource: `User`, `Team`, `PTO`, `Holiday`, etc. |
| `resourceId` | ObjectId | No | Reference to the affected resource |
| `changes` | Object | No | Before/after state for UPDATE actions |
| `ipAddress` | String | No | IP address of the client |
| `userAgent` | String | No | Browser/client user agent |
| `status` | String | Yes | Result: `success` or `failure` |
| `errorMessage` | String | No | Error details if status is failure |
| `timestamp` | Date | Yes | When the action occurred (default: now) |

**Indexes:** `userId`, `action`, `resourceType`, `timestamp`

**Notes:**
- Automatically created by audit middleware
- Immutable records (no updates or deletes allowed)
- Admin-only read access

---

### 8. EmailSchedule Model

**Collection:** `emailschedules`

Email scheduling and delivery tracking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `emailType` | String | Yes | Type: `weekly_insights`, `monthly_report`, `custom` |
| `recipients` | Array[String] | Yes | Email addresses to send to |
| `subject` | String | Yes | Email subject line |
| `htmlContent` | String | No | HTML email body |
| `attachments` | Array[Object] | No | Email attachments |
| `scheduledFor` | Date | Yes | When to send the email |
| `sentAt` | Date | No | Actual send timestamp |
| `status` | String | Yes | Status: `scheduled`, `sent`, `failed` |
| `errorMessage` | String | No | Error details if delivery failed |
| `metadata` | Object | No | Additional context (team, period, etc.) |
| `createdBy` | ObjectId | No | Reference to User who created schedule |
| `createdAt` | Date | Auto | Schedule creation timestamp |

**Indexes:** `status`, `scheduledFor`, `emailType`

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Download |
|------------|---------|----------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | 6.x or higher | [mongodb.com](https://www.mongodb.com/) |
| **npm** | 9.x or higher | Included with Node.js |
| **Jira Cloud** | - | [atlassian.com](https://www.atlassian.com/software/jira) |
| **Ollama** (Optional) | Latest | [ollama.ai](https://ollama.ai/) |

### Installation Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express, mongoose, jsonwebtoken, bcryptjs
- joi, winston, morgan, helmet, cors
- nodemailer, axios, date-fns
- And all development dependencies

#### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# ========================================
# SERVER CONFIGURATION
# ========================================
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# ========================================
# DATABASE
# ========================================
MONGODB_URI=mongodb://localhost:27017/team-management
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-management

# ========================================
# JWT AUTHENTICATION
# ========================================
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ========================================
# JIRA INTEGRATION (Required)
# ========================================
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token-here

# To get Jira API token:
# 1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
# 2. Click "Create API token"
# 3. Copy and paste here

# ========================================
# OLLAMA AI (Optional - for AI insights)
# ========================================
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_TIMEOUT=60000
OLLAMA_CONTEXT_WINDOW=4096

# If Ollama not configured, AI insights will be disabled
# To install Ollama: https://ollama.ai/

# ========================================
# EMAIL/SMTP (Optional - for notifications)
# ========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=Team Management <noreply@company.com>

# For Gmail app password:
# 1. Enable 2-factor authentication
# 2. Go to https://myaccount.google.com/apppasswords
# 3. Generate app password

# ========================================
# APPLICATION SETTINGS
# ========================================
LOG_LEVEL=info
# Options: error, warn, info, http, verbose, debug

RATE_LIMIT=100
# Requests per 15 minutes per IP

DEFAULT_WORKING_HOURS_PER_DAY=8
# Standard working hours per day

DEFAULT_LOCATION=US
# Default location for holidays
```

#### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod --dbpath /path/to/your/data
```

**Option B: MongoDB Docker**
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

**Option C: MongoDB Atlas**
- Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Update `MONGODB_URI` in `.env`

#### 5. (Optional) Set Up Ollama for AI Features

```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2

# Verify Ollama is running
curl http://localhost:11434/api/tags
```

#### 6. Initialize Database (Optional)

```bash
# Seed initial data (admin user, sample teams, holidays)
node scripts/seedData.js
```

#### 7. Start Development Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will start on `http://localhost:5000`

#### 8. Verify Installation

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Quick Start - First API Call

```bash
# 1. Register admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@company.com",
    "password":"SecurePass123!",
    "firstName":"Admin",
    "lastName":"User",
    "role":"admin"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@company.com",
    "password":"SecurePass123!"
  }'

# Save the token from response

# 3. Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📚 API Documentation

### API Response Format

All API responses follow a consistent structure:

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require authentication. Include JWT token in header:

```
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Authentication Endpoints

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "viewer"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "viewer"
    }
  }
}
```

---

#### POST `/api/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "viewer",
      "teams": ["507f191e810c19729de860ea"]
    }
  }
}
```

---

#### POST `/api/auth/logout`

Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST `/api/auth/refresh`

Refresh JWT access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### GET `/api/auth/me`

Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "viewer",
    "teams": ["507f191e810c19729de860ea"],
    "active": true,
    "lastLogin": "2025-10-24T10:30:00.000Z",
    "createdAt": "2025-01-15T08:00:00.000Z"
  }
}
```

---

#### PUT `/api/auth/change-password`

Change user's password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 👥 Teams Endpoints

#### GET `/api/teams`

Get all teams with optional filtering and pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `active` (boolean) - Filter by active status
- `location` (string) - Filter by location
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `sort` (string) - Sort by field (default: 'teamName')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "507f191e810c19729de860ea",
        "teamId": "ENG-001",
        "teamName": "Engineering Team",
        "description": "Core engineering team",
        "location": "US",
        "members": 12,
        "jiraProjectKey": "PROJ",
        "active": true,
        "createdAt": "2025-01-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pages": 1,
      "limit": 20
    }
  }
}
```

---

#### POST `/api/teams`

Create a new team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamId": "ENG-001",
  "teamName": "Engineering Team",
  "description": "Core engineering team",
  "location": "US",
  "jiraProjectKey": "PROJ"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Team created successfully",
  "data": {
    "id": "507f191e810c19729de860ea",
    "teamId": "ENG-001",
    "teamName": "Engineering Team",
    "description": "Core engineering team",
    "location": "US",
    "jiraProjectKey": "PROJ",
    "active": true,
    "createdAt": "2025-10-24T10:30:00.000Z"
  }
}
```

---

#### GET `/api/teams/:id`

Get team by ID with members.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f191e810c19729de860ea",
    "teamId": "ENG-001",
    "teamName": "Engineering Team",
    "description": "Core engineering team",
    "location": "US",
    "jiraProjectKey": "PROJ",
    "members": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@company.com",
        "jiraAccountId": "5d123abc456def789012ghij",
        "designation": "Senior Engineer",
        "joinDate": "2025-01-15T00:00:00.000Z"
      }
    ],
    "active": true,
    "createdAt": "2025-01-15T08:00:00.000Z"
  }
}
```

---

#### PUT `/api/teams/:id`

Update team details (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamName": "Updated Team Name",
  "description": "Updated description",
  "location": "India",
  "jiraProjectKey": "NEWPROJ"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team updated successfully",
  "data": {
    "id": "507f191e810c19729de860ea",
    "teamId": "ENG-001",
    "teamName": "Updated Team Name",
    "description": "Updated description",
    "location": "India",
    "jiraProjectKey": "NEWPROJ",
    "updatedAt": "2025-10-24T11:00:00.000Z"
  }
}
```

---

#### DELETE `/api/teams/:id`

Delete a team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

---

#### GET `/api/teams/:id/members`

Get all members of a team.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "teamId": "507f191e810c19729de860ea",
    "teamName": "Engineering Team",
    "members": [
      {
        "id": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@company.com",
        "jiraAccountId": "5d123abc456def789012ghij",
        "designation": "Senior Engineer",
        "joinDate": "2025-01-15T00:00:00.000Z",
        "active": true
      }
    ]
  }
}
```

---

#### POST `/api/teams/:id/members`

Add a member to a team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "jiraAccountId": "5d123abc456def789012ghij",
  "designation": "Senior Engineer",
  "joinDate": "2025-10-24"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Member added to team successfully",
  "data": {
    "id": "507f191e810c19729de860eb",
    "userId": "507f1f77bcf86cd799439011",
    "teamId": "507f191e810c19729de860ea",
    "jiraAccountId": "5d123abc456def789012ghij",
    "designation": "Senior Engineer",
    "joinDate": "2025-10-24T00:00:00.000Z",
    "active": true
  }
}
```

---

#### PUT `/api/teams/:id/members/:memberId`

Update team member details (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "designation": "Lead Engineer",
  "jiraAccountId": "5d123abc456def789012ghij"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team member updated successfully",
  "data": {
    "id": "507f191e810c19729de860eb",
    "userId": "507f1f77bcf86cd799439011",
    "teamId": "507f191e810c19729de860ea",
    "jiraAccountId": "5d123abc456def789012ghij",
    "designation": "Lead Engineer",
    "updatedAt": "2025-10-24T11:30:00.000Z"
  }
}
```

---

#### DELETE `/api/teams/:id/members/:memberId`

Remove a member from a team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Member removed from team successfully"
}
```

---

### 📅 Holidays Endpoints

#### GET `/api/holidays`

Get holidays with filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `location` (string) - Filter by location: `US`, `India`, `Global`
- `year` (number) - Filter by year
- `month` (number) - Filter by month (1-12)
- `sort` (string) - Sort by: `date`, `name` (default: `date`)
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "holidays": [
      {
        "id": "507f191e810c19729de860ec",
        "holidayName": "New Year's Day",
        "date": "2025-01-01T00:00:00.000Z",
        "location": "Global",
        "hours": 8,
        "description": "First day of the year",
        "recurring": true,
        "active": true,
        "createdAt": "2024-12-01T08:00:00.000Z"
      },
      {
        "id": "507f191e810c19729de860ed",
        "holidayName": "Christmas Eve (Half Day)",
        "date": "2025-12-24T00:00:00.000Z",
        "location": "US",
        "hours": 4,
        "description": "Half day before Christmas",
        "recurring": true,
        "active": true,
        "createdAt": "2024-12-01T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "pages": 1,
      "limit": 20
    }
  }
}
```

---

#### POST `/api/holidays`

Create a new holiday (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "holidayName": "Independence Day",
  "date": "2025-07-04",
  "location": "US",
  "hours": 8,
  "description": "US Independence Day",
  "recurring": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Holiday created successfully",
  "data": {
    "id": "507f191e810c19729de860ee",
    "holidayName": "Independence Day",
    "date": "2025-07-04T00:00:00.000Z",
    "location": "US",
    "hours": 8,
    "description": "US Independence Day",
    "recurring": true,
    "active": true,
    "createdAt": "2025-10-24T10:30:00.000Z"
  }
}
```

---

#### GET `/api/holidays/:id`

Get holiday by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f191e810c19729de860ec",
    "holidayName": "New Year's Day",
    "date": "2025-01-01T00:00:00.000Z",
    "location": "Global",
    "hours": 8,
    "description": "First day of the year",
    "recurring": true,
    "active": true,
    "createdBy": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Admin",
      "lastName": "User"
    },
    "createdAt": "2024-12-01T08:00:00.000Z"
  }
}
```

---

#### PUT `/api/holidays/:id`

Update holiday (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "holidayName": "Updated Holiday Name",
  "hours": 4,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Holiday updated successfully",
  "data": {
    "id": "507f191e810c19729de860ec",
    "holidayName": "Updated Holiday Name",
    "date": "2025-01-01T00:00:00.000Z",
    "location": "Global",
    "hours": 4,
    "description": "Updated description",
    "updatedAt": "2025-10-24T11:00:00.000Z"
  }
}
```

---

#### DELETE `/api/holidays/:id`

Delete a holiday (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Holiday deleted successfully"
}
```

---

### 🏖️ PTO Endpoints

#### GET `/api/pto`

Get all PTO requests with filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `userId` (string) - Filter by user ID
- `teamId` (string) - Filter by team ID
- `status` (string) - Filter by status: `pending`, `approved`, `rejected`
- `type` (string) - Filter by type: `vacation`, `sick`, `personal`, `other`
- `startDate` (ISO date) - Filter PTOs starting after this date
- `endDate` (ISO date) - Filter PTOs ending before this date
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ptos": [
      {
        "id": "507f191e810c19729de860ef",
        "userId": "507f1f77bcf86cd799439011",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@company.com"
        },
        "startDate": "2025-12-20T00:00:00.000Z",
        "endDate": "2025-12-24T00:00:00.000Z",
        "type": "vacation",
        "status": "approved",
        "duration": 40,
        "reason": "Holiday vacation",
        "approvedBy": {
          "id": "507f1f77bcf86cd799439012",
          "firstName": "Manager",
          "lastName": "Smith"
        },
        "approvedAt": "2025-12-10T14:30:00.000Z",
        "createdAt": "2025-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 2,
      "limit": 20
    }
  }
}
```

---

#### POST `/api/pto`

Create a new PTO request.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "startDate": "2025-12-20",
  "endDate": "2025-12-24",
  "type": "vacation",
  "reason": "Holiday vacation",
  "notes": "Will be checking emails periodically"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "PTO request created successfully",
  "data": {
    "id": "507f191e810c19729de860ef",
    "userId": "507f1f77bcf86cd799439011",
    "startDate": "2025-12-20T00:00:00.000Z",
    "endDate": "2025-12-24T00:00:00.000Z",
    "type": "vacation",
    "status": "pending",
    "duration": 40,
    "reason": "Holiday vacation",
    "notes": "Will be checking emails periodically",
    "createdAt": "2025-10-24T10:30:00.000Z"
  }
}
```

---

#### GET `/api/pto/:id`

Get PTO request by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f191e810c19729de860ef",
    "userId": "507f1f77bcf86cd799439011",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@company.com"
    },
    "startDate": "2025-12-20T00:00:00.000Z",
    "endDate": "2025-12-24T00:00:00.000Z",
    "type": "vacation",
    "status": "pending",
    "duration": 40,
    "reason": "Holiday vacation",
    "notes": "Will be checking emails periodically",
    "createdAt": "2025-10-24T10:30:00.000Z"
  }
}
```

---

#### PUT `/api/pto/:id`

Update PTO request (own requests only, before approval).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "startDate": "2025-12-21",
  "endDate": "2025-12-24",
  "reason": "Updated vacation reason"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "PTO request updated successfully",
  "data": {
    "id": "507f191e810c19729de860ef",
    "startDate": "2025-12-21T00:00:00.000Z",
    "endDate": "2025-12-24T00:00:00.000Z",
    "duration": 32,
    "reason": "Updated vacation reason",
    "updatedAt": "2025-10-24T11:00:00.000Z"
  }
}
```

---

#### DELETE `/api/pto/:id`

Delete PTO request (own requests only, before approval).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "PTO request deleted successfully"
}
```

---

#### POST `/api/pto/:id/approve`

Approve a PTO request (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notes": "Approved - enjoy your vacation!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "PTO request approved successfully",
  "data": {
    "id": "507f191e810c19729de860ef",
    "status": "approved",
    "approvedBy": "507f1f77bcf86cd799439012",
    "approvedAt": "2025-10-24T11:30:00.000Z",
    "notes": "Approved - enjoy your vacation!"
  }
}
```

---

#### POST `/api/pto/:id/reject`

Reject a PTO request (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rejectionReason": "Insufficient coverage during that period"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "PTO request rejected",
  "data": {
    "id": "507f191e810c19729de860ef",
    "status": "rejected",
    "approvedBy": "507f1f77bcf86cd799439012",
    "approvedAt": "2025-10-24T11:30:00.000Z",
    "rejectionReason": "Insufficient coverage during that period"
  }
}
```

---

### 🔍 Jira Query Endpoints

#### GET `/api/jira-query/team/:teamId`

Get all JQL queries for a team.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "teamId": "507f191e810c19729de860ea",
    "teamName": "Engineering Team",
    "queries": [
      {
        "id": "507f191e810c19729de860f0",
        "jqlKey": "hist_query",
        "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND created >= -30d",
        "description": "Historical query for team view",
        "active": true,
        "createdAt": "2025-01-15T08:00:00.000Z"
      },
      {
        "id": "507f191e810c19729de860f1",
        "jqlKey": "workinsights_query",
        "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND status = Done AND updated >= -7d",
        "description": "Query for AI insights",
        "active": true,
        "createdAt": "2025-01-15T08:00:00.000Z"
      }
    ]
  }
}
```

---

#### GET `/api/jira-query/:id`

Get a specific JQL query by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f191e810c19729de860f0",
    "teamId": "507f191e810c19729de860ea",
    "jqlKey": "hist_query",
    "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND created >= -30d",
    "description": "Historical query for team view",
    "active": true,
    "createdBy": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Admin",
      "lastName": "User"
    },
    "createdAt": "2025-01-15T08:00:00.000Z"
  }
}
```

---

#### POST `/api/jira-query`

Create a new JQL query for a team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamId": "507f191e810c19729de860ea",
  "jqlKey": "future_capacity",
  "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND sprint in openSprints()",
  "description": "Query for future capacity planning"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "JQL query created successfully",
  "data": {
    "id": "507f191e810c19729de860f2",
    "teamId": "507f191e810c19729de860ea",
    "jqlKey": "future_capacity",
    "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND sprint in openSprints()",
    "description": "Query for future capacity planning",
    "active": true,
    "createdAt": "2025-10-24T10:30:00.000Z"
  }
}
```

**Note:** The system automatically replaces assignee account IDs with actual team members' `jiraAccountId` values when executing queries.

---

#### PUT `/api/jira-query/:id`

Update a JQL query (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND created >= -60d",
  "description": "Updated to last 60 days"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "JQL query updated successfully",
  "data": {
    "id": "507f191e810c19729de860f0",
    "jqlQuery": "project = PROJ AND assignee in (accountId1, accountId2) AND created >= -60d",
    "description": "Updated to last 60 days",
    "updatedAt": "2025-10-24T11:00:00.000Z"
  }
}
```

---

#### DELETE `/api/jira-query/:id`

Delete a JQL query (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "JQL query deleted successfully"
}
```

---

### 📈 Time Trend Endpoints

#### GET `/api/time-trend/associate`

Get time trend data for an associate (individual team member).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `teamId` (string, required) - Team ID
- `userId` (string, required) - User ID
- `startDate` (ISO date, required) - Start date for analysis
- `endDate` (ISO date, required) - End date for analysis

**Response (200):**
```json
{
  "success": true,
  "data": {
    "associate": {
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@company.com",
      "jiraAccountId": "5d123abc456def789012ghij"
    },
    "period": {
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.999Z",
      "workingDays": 21,
      "totalWorkingHours": 168,
      "holidays": 1,
      "holidayHours": 8,
      "ptoHours": 0
    },
    "metrics": {
      "totalIssues": 15,
      "totalStoryPoints": 89,
      "totalTimeSpent": 140,
      "totalOriginalEstimate": 160,
      "utilization": 83.33,
      "storyBurnRate": 0.64,
      "timeActualVsOriginal": 0.875
    },
    "issues": [
      {
        "key": "PROJ-123",
        "summary": "Implement user authentication",
        "issueType": "Story",
        "status": "Done",
        "storyPoints": 13,
        "timeSpent": 12,
        "originalEstimate": 16,
        "created": "2025-01-05T09:00:00.000Z",
        "updated": "2025-01-15T17:30:00.000Z"
      }
    ]
  }
}
```

---

#### GET `/api/time-trend/team`

Get time trend data for entire team.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `teamId` (string, required) - Team ID
- `startDate` (ISO date, required) - Start date
- `endDate` (ISO date, required) - End date

**Response (200):**
```json
{
  "success": true,
  "data": {
    "team": {
      "teamId": "507f191e810c19729de860ea",
      "teamName": "Engineering Team",
      "memberCount": 12
    },
    "period": {
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.999Z",
      "workingDays": 21
    },
    "teamMetrics": {
      "totalIssues": 180,
      "totalStoryPoints": 987,
      "totalTimeSpent": 1680,
      "averageUtilization": 87.5,
      "averageBurnRate": 0.59
    },
    "memberMetrics": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "totalIssues": 15,
        "totalStoryPoints": 89,
        "totalTimeSpent": 140,
        "utilization": 83.33,
        "storyBurnRate": 0.64
      }
    ]
  }
}
```

---

#### GET `/api/time-trend/team/monthly`

Get monthly aggregated team metrics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `teamId` (string, required) - Team ID
- `year` (number, required) - Year (e.g., 2025)
- `month` (number, required) - Month (1-12)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "team": {
      "teamId": "507f191e810c19729de860ea",
      "teamName": "Engineering Team"
    },
    "period": {
      "year": 2025,
      "month": 1,
      "monthName": "January",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.999Z",
      "workingDays": 21
    },
    "metrics": {
      "totalIssues": 180,
      "totalStoryPoints": 987,
      "totalTimeSpent": 1680,
      "totalOriginalEstimate": 1920,
      "averageUtilization": 87.5,
      "averageBurnRate": 0.59,
      "timeActualVsOriginal": 0.875
    },
    "weeklyBreakdown": [
      {
        "week": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-01-05",
        "issuesCompleted": 35,
        "storyPoints": 192
      }
    ]
  }
}
```

---

#### GET `/api/time-trend/individual/:userId`

Get detailed individual performance metrics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (ISO date, required) - Start date
- `endDate` (ISO date, required) - End date

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@company.com"
    },
    "period": {
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.999Z",
      "workingDays": 21,
      "totalWorkingHours": 168
    },
    "performanceMetrics": {
      "totalIssues": 15,
      "totalStoryPoints": 89,
      "totalTimeSpent": 140,
      "utilization": 83.33,
      "storyBurnRate": 0.64,
      "averageTimePerIssue": 9.33,
      "averageStoryPointsPerIssue": 5.93
    },
    "issueBreakdown": {
      "byType": {
        "Story": 8,
        "Bug": 5,
        "Task": 2
      },
      "byStatus": {
        "Done": 15,
        "In Progress": 0
      }
    },
    "trend": {
      "direction": "improving",
      "utilizationChange": "+5.2%",
      "burnRateChange": "+0.08"
    }
  }
}
```

---

### 🤖 Teamwork Insights Endpoints (AI-Powered)

#### POST `/api/teamwork-insights/generate`

Generate AI-powered team insights using Ollama.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamId": "507f191e810c19729de860ea",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "team": {
      "teamId": "507f191e810c19729de860ea",
      "teamName": "Engineering Team"
    },
    "period": {
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.999Z",
      "workingDays": 21
    },
    "teamMetrics": {
      "totalIssuesCompleted": 180,
      "totalStoryPoints": 987,
      "teamUtilization": 87.5,
      "teamBurnRate": 0.59
    },
    "members": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "metrics": {
          "issuesCompleted": 15,
          "storyPoints": 89,
          "utilization": 83.33,
          "burnRate": 0.64
        },
        "aiSummary": "John demonstrated strong productivity this month, completing 15 issues with 89 story points. His utilization of 83% shows good work-life balance while maintaining high output. Notable achievements include leading the authentication module implementation and mentoring junior developers. Areas for improvement: Consider breaking down larger stories for better predictability."
      }
    ],
    "teamSummary": "The Engineering Team had an excellent month with 180 issues completed and 987 story points delivered. The team utilization of 87.5% indicates healthy productivity levels. Key highlights include successful deployment of three major features and improved story burn rate. Recommended actions: Continue current sprint planning approach and consider slight capacity adjustment for next quarter."
  }
}
```

**Note:** Requires Ollama to be configured and running. If Ollama is unavailable, AI summaries will be replaced with standard metric summaries.

---

#### POST `/api/teamwork-insights/export-html`

Export team insights as formatted HTML report.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamId": "507f191e810c19729de860ea",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "includeCharts": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "HTML report generated successfully",
  "data": {
    "filename": "team_insights_ENG-001_2025-01.html",
    "size": 45678,
    "downloadUrl": "/api/reports/download/team_insights_ENG-001_2025-01.html"
  }
}
```

---

#### POST `/api/teamwork-insights/send-email`

Send team insights via email.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamId": "507f191e810c19729de860ea",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "recipients": [
    "manager@company.com",
    "director@company.com"
  ],
  "subject": "Engineering Team - January 2025 Insights",
  "includeAttachment": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Insights email sent successfully",
  "data": {
    "recipients": ["manager@company.com", "director@company.com"],
    "sentAt": "2025-10-24T12:00:00.000Z",
    "emailId": "507f191e810c19729de860f3"
  }
}
```

**Note:** Requires SMTP to be configured. Email will include HTML-formatted insights and optional PDF attachment.

---

### 🔮 Future Capacity Endpoints

#### POST `/api/future-capacity/calculate`

Calculate team capacity for a future period considering holidays and scheduled PTO.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamId": "507f191e810c19729de860ea",
  "startDate": "2025-02-01",
  "endDate": "2025-02-28"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "team": {
      "teamId": "507f191e810c19729de860ea",
      "teamName": "Engineering Team",
      "memberCount": 12,
      "location": "US"
    },
    "period": {
      "startDate": "2025-02-01T00:00:00.000Z",
      "endDate": "2025-02-28T23:59:59.999Z",
      "totalDays": 28,
      "weekendDays": 8,
      "workingDays": 20,
      "holidays": [
        {
          "date": "2025-02-17",
          "name": "Presidents' Day",
          "hours": 8
        }
      ],
      "totalHolidayHours": 8
    },
    "teamCapacity": {
      "totalAvailableHours": 1920,
      "totalHolidayHours": 96,
      "totalPTOHours": 160,
      "totalWorkingHours": 1664,
      "averageUtilizationTarget": 85,
      "estimatedCapacityStoryPoints": 2078
    },
    "memberCapacity": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "totalAvailableHours": 160,
        "holidayHours": 8,
        "ptoHours": 0,
        "workingHours": 152,
        "utilizationTarget": 85,
        "effectiveWorkingHours": 129.2,
        "estimatedStoryPoints": 190,
        "status": "available"
      },
      {
        "userId": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "totalAvailableHours": 160,
        "holidayHours": 8,
        "ptoHours": 40,
        "workingHours": 112,
        "utilizationTarget": 85,
        "effectiveWorkingHours": 95.2,
        "estimatedStoryPoints": 140,
        "status": "limited",
        "ptoDetails": [
          {
            "startDate": "2025-02-17",
            "endDate": "2025-02-21",
            "type": "vacation",
            "hours": 40
          }
        ]
      }
    ],
    "recommendations": [
      "Team has 1664 effective working hours in February",
      "2 team members have scheduled PTO during this period",
      "Consider Sprint planning based on 2078 story points capacity",
      "Presidents' Day holiday on Feb 17 reduces capacity by 96 hours"
    ]
  }
}
```

---

#### GET `/api/future-capacity/team/:teamId`

Get capacity summary for a specific team.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (ISO date, required)
- `endDate` (ISO date, required)

**Response:** Same structure as `POST /calculate` endpoint

---

#### GET `/api/future-capacity/date-range`

Get capacity for multiple teams in a date range.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (ISO date, required)
- `endDate` (ISO date, required)
- `location` (string, optional) - Filter teams by location

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-02-01T00:00:00.000Z",
      "endDate": "2025-02-28T23:59:59.999Z",
      "workingDays": 20
    },
    "teams": [
      {
        "teamId": "507f191e810c19729de860ea",
        "teamName": "Engineering Team",
        "memberCount": 12,
        "totalWorkingHours": 1664,
        "estimatedStoryPoints": 2078
      },
      {
        "teamId": "507f191e810c19729de860eb",
        "teamName": "QA Team",
        "memberCount": 5,
        "totalWorkingHours": 760,
        "estimatedStoryPoints": 950
      }
    ],
    "totalCapacity": {
      "totalTeams": 2,
      "totalMembers": 17,
      "totalWorkingHours": 2424,
      "totalEstimatedStoryPoints": 3028
    }
  }
}
```

---

#### GET `/api/future-capacity/analytics`

Get capacity analytics and trends.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `teamId` (string, optional) - Specific team or all teams
- `months` (number, default: 3) - Number of months to analyze

**Response (200):**
```json
{
  "success": true,
  "data": {
    "team": {
      "teamId": "507f191e810c19729de860ea",
      "teamName": "Engineering Team"
    },
    "analysis": {
      "averageMonthlyCapacity": 1950,
      "capacityTrend": "stable",
      "averagePTOHours": 120,
      "peakPTOMonth": "December",
      "lowestCapacityMonth": "December",
      "highestCapacityMonth": "March"
    },
    "monthlyBreakdown": [
      {
        "month": "2025-02",
        "totalWorkingHours": 1664,
        "ptoHours": 160,
        "capacityPercentage": 91.3
      },
      {
        "month": "2025-03",
        "totalWorkingHours": 1920,
        "ptoHours": 80,
        "capacityPercentage": 95.8
      }
    ],
    "recommendations": [
      "Consider hiring buffer for December due to high PTO volume",
      "March shows highest capacity - good for major releases",
      "Current team size maintains stable capacity year-round"
    ]
  }
}
```

---

### 🔒 Audit Log Endpoints (Admin Only)

#### GET `/api/audit-logs`

Get all audit logs with filtering and pagination.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** Admin

**Query Parameters:**
- `userId` (string) - Filter by user
- `action` (string) - Filter by action: `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `APPROVE`, `REJECT`
- `resourceType` (string) - Filter by resource: `User`, `Team`, `PTO`, `Holiday`, etc.
- `status` (string) - Filter by status: `success`, `failure`
- `startDate` (ISO date) - Filter logs after this date
- `endDate` (ISO date) - Filter logs before this date
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "507f191e810c19729de860f4",
        "userId": "507f1f77bcf86cd799439011",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@company.com"
        },
        "action": "UPDATE",
        "resourceType": "Team",
        "resourceId": "507f191e810c19729de860ea",
        "changes": {
          "before": {
            "teamName": "Engineering"
          },
          "after": {
            "teamName": "Engineering Team"
          }
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "status": "success",
        "timestamp": "2025-10-24T11:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1523,
      "page": 1,
      "pages": 77,
      "limit": 20
    }
  }
}
```

---

#### GET `/api/audit-logs/:id`

Get audit log by ID.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** Admin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f191e810c19729de860f4",
    "userId": "507f1f77bcf86cd799439011",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@company.com"
    },
    "action": "UPDATE",
    "resourceType": "Team",
    "resourceId": "507f191e810c19729de860ea",
    "changes": {
      "before": {
        "teamName": "Engineering",
        "description": "Old description"
      },
      "after": {
        "teamName": "Engineering Team",
        "description": "Core engineering team"
      }
    },
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "status": "success",
    "timestamp": "2025-10-24T11:30:00.000Z"
  }
}
```

---

### ⚙️ Constants Endpoint

#### GET `/api/constants`

Get application constants for frontend (no authentication required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "USER_ROLES": {
      "ADMIN": "admin",
      "VIEWER": "viewer"
    },
    "PTO_TYPES": {
      "VACATION": "vacation",
      "SICK": "sick",
      "PERSONAL": "personal",
      "OTHER": "other"
    },
    "PTO_STATUS": {
      "PENDING": "pending",
      "APPROVED": "approved",
      "REJECTED": "rejected"
    },
    "LOCATIONS": {
      "US": "US",
      "INDIA": "India",
      "GLOBAL": "Global"
    },
    "ISSUE_STATUS": {
      "TO_DO": "To Do",
      "IN_PROGRESS": "In Progress",
      "DONE": "Done",
      "BLOCKED": "Blocked",
      "CLOSED": "Closed"
    },
    "ISSUE_TYPES": {
      "STORY": "Story",
      "BUG": "Bug",
      "TASK": "Task",
      "EPIC": "Epic",
      "SUBTASK": "Sub-task"
    },
    "EMAIL_TYPES": {
      "WEEKLY_INSIGHTS": "weekly_insights",
      "MONTHLY_REPORT": "monthly_report",
      "CUSTOM": "custom"
    },
    "AUDIT_ACTIONS": {
      "CREATE": "CREATE",
      "UPDATE": "UPDATE",
      "DELETE": "DELETE",
      "LOGIN": "LOGIN",
      "LOGOUT": "LOGOUT",
      "APPROVE": "APPROVE",
      "REJECT": "REJECT"
    },
    "DEFAULT_WORKING_HOURS_PER_DAY": 8,
    "DEFAULT_PAGINATION_LIMIT": 20,
    "MAX_PAGINATION_LIMIT": 100
  }
}
```

**Note:** This endpoint is public and doesn't require authentication. It provides constants needed by the frontend application.

---

## 🔧 Services

### JiraService

Handles all Jira API interactions.

**Key Methods:**

```javascript
// Search issues with JQL
const issues = await jiraService.searchIssues({
  jql: 'project = PROJ AND created >= -30d',
  fields: ['key', 'summary', 'status', 'timetracking'],
  maxResults: 100
});

// Get single issue
const issue = await jiraService.getIssue('PROJ-123');

// Get user by account ID
const user = await jiraService.getUser('accountId123');

// Search users
const users = await jiraService.searchUsers('john.doe');
```

**Features:**
- ✅ Automatic authentication using API token
- ✅ Error handling and retry logic
- ✅ Response parsing and normalization
- ✅ Story points extraction (custom field support)
- ✅ Time tracking data parsing

---

### OllamaService

AI-powered text generation using Ollama LLM.

**Key Methods:**

```javascript
// Generate team member summary
const summary = await ollamaService.generateSummary({
  content: 'John completed 15 tickets with 89 story points...',
  model: 'llama3.2',
  maxTokens: 500,
  temperature: 0.7
});

// Custom prompt
const response = await ollamaService.prompt({
  prompt: 'Analyze this team performance data...',
  context: previousContext
});
```

**Features:**
- ✅ Configurable model selection
- ✅ Temperature and token control
- ✅ Context window management
- ✅ Streaming support (future)
- ✅ Fallback to basic summaries if unavailable

---

### EmailService

Email notification and report delivery.

**Key Methods:**

```javascript
// Send weekly insights email
await emailService.sendWeeklyInsights({
  recipients: ['manager@company.com'],
  teamName: 'Engineering',
  insights: teamInsightsData,
  period: { startDate, endDate }
});

// Send custom email
await emailService.send({
  to: 'user@company.com',
  subject: 'PTO Approved',
  html: '<p>Your PTO request has been approved</p>',
  attachments: [{ filename: 'report.pdf', path: '/path/to/report.pdf' }]
});

// Send PTO approval notification
await emailService.sendPTOApproval({
  to: 'user@company.com',
  ptoDetails: { startDate, endDate, type }
});
```

**Features:**
- ✅ HTML email templates
- ✅ Attachment support
- ✅ Delivery tracking
- ✅ Retry logic
- ✅ Template system

---

### DateService

Date calculations and working hours management.

**Key Methods:**

```javascript
// Get working days (excludes weekends, holidays, PTO)
const workingDays = await dateService.getWorkingDays(
  startDate,
  endDate,
  'team-id',
  'user-id'
);

// Get working hours
const workingHours = await dateService.getWorkingHours(
  startDate,
  endDate,
  'team-id',
  'user-id',
  'US' // location
);

// Get business days (weekdays only)
const businessDays = dateService.getBusinessDays(startDate, endDate);

// Check if date is a holiday
const isHoliday = await dateService.isHoliday(date, 'US');

// Get holidays in date range
const holidays = await dateService.getHolidaysInRange(
  startDate,
  endDate,
  'US'
);

// Get PTO hours for a user
const ptoHours = await dateService.getPTOHours(
  'user-id',
  startDate,
  endDate
);
```

**Calculation Logic:**

```
Working Hours = Total Business Hours - Holiday Hours - PTO Hours

Where:
- Business Hours = (Business Days) × (Hours Per Day)
- Business Days = Weekdays only (Mon-Fri)
- Holiday Hours = Sum of hours from Holiday model
- PTO Hours = Sum of hours from approved PTO requests
```

**Features:**
- ✅ Timezone-aware calculations
- ✅ Holiday hours support (full/half/custom)
- ✅ PTO integration
- ✅ Location-specific holidays
- ✅ Weekend detection
- ✅ Date range utilities

---

### CapacityCalculationService

Team capacity planning and forecasting.

**Key Methods:**

```javascript
// Calculate team capacity
const capacity = await capacityCalculator.calculateTeamCapacity({
  teamId: 'team-id',
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-02-28'),
  includeWorkload: true
});

// Calculate member capacity
const memberCapacity = await capacityCalculator.calculateMemberCapacity({
  userId: 'user-id',
  startDate,
  endDate,
  utilizationTarget: 85 // percentage
});

// Get capacity with story point estimation
const estimatedCapacity = await capacityCalculator.estimateStoryPoints({
  teamId: 'team-id',
  startDate,
  endDate,
  historicalBurnRate: 1.5 // story points per hour
});
```

**Capacity Formula:**

```
Effective Working Hours = Working Hours × Utilization Target

Story Points Capacity = Effective Working Hours × Historical Burn Rate

Where:
- Working Hours = Total hours - PTO hours - Holiday hours
- Utilization Target = Typically 85% (allows for meetings, reviews, etc.)
- Historical Burn Rate = Average story points completed per hour
```

**Features:**
- ✅ Team-level capacity calculation
- ✅ Individual member capacity
- ✅ PTO and holiday consideration
- ✅ Utilization target customization
- ✅ Story point estimation
- ✅ Historical burn rate analysis

---

### ReportGenerator

HTML and PDF report generation.

**Key Methods:**

```javascript
// Generate weekly team report
const report = await reportGenerator.generateWeeklyReport({
  teamId: 'team-id',
  startDate,
  endDate,
  format: 'html' // or 'pdf'
});

// Generate capacity report
const capacityReport = await reportGenerator.generateCapacityReport({
  teamId: 'team-id',
  futureMonths: 3
});

// Generate custom report from template
const customReport = await reportGenerator.generateFromTemplate({
  template: 'team-insights',
  data: insightsData,
  options: { includeCharts: true }
});
```

**Features:**
- ✅ HTML report generation
- ✅ PDF export (future)
- ✅ Chart integration
- ✅ Template system
- ✅ Custom branding support

---

## 🔐 Authentication & Authorization

### JWT Token Structure

Tokens contain the following claims:

```javascript
{
  userId: "507f1f77bcf86cd799439011",
  email: "user@company.com",
  role: "admin", // or "viewer"
  teams: ["507f191e810c19729de860ea"],
  iat: 1729768200,  // Issued at timestamp
  exp: 1730373000   // Expiration timestamp (7 days)
}
```

### Token Lifecycle

1. **Login** - User provides credentials → Server issues access token + refresh token
2. **Request** - Client includes access token in Authorization header
3. **Validation** - Middleware validates token, checks expiration, loads user
4. **Refresh** - When access token expires, use refresh token to get new access token
5. **Logout** - Client discards tokens, server records logout in audit log

### Password Security

- **Hashing:** bcrypt with 10 rounds
- **Validation:** Minimum 8 characters
- **Change Detection:** `passwordChangedAt` field invalidates old tokens

### Protected Routes

All routes except the following require authentication:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/constants`

### Role-Based Access Control (RBAC)

| Endpoint Category | Admin | Viewer |
|-------------------|-------|--------|
| **Auth** | | |
| Login/Register/Logout | ✅ | ✅ |
| Change Password | ✅ | ✅ |
| **Teams** | | |
| View Teams/Members | ✅ | ✅ |
| Create/Update/Delete Team | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| **Users** | | |
| View All Users | ✅ | ❌ |
| Create/Update/Delete User | ✅ | ❌ |
| View Own Profile | ✅ | ✅ |
| **Holidays** | | |
| View Holidays | ✅ | ✅ |
| Create/Update/Delete Holiday | ✅ | ❌ |
| **PTO** | | |
| View Own PTO | ✅ | ✅ |
| Create Own PTO Request | ✅ | ✅ |
| Update/Delete Own PTO | ✅ | ✅ |
| View All PTO | ✅ | ❌ |
| Approve/Reject PTO | ✅ | ❌ |
| **Jira Queries** | | |
| View JQL Queries | ✅ | ✅ |
| Create/Update/Delete JQL | ✅ | ❌ |
| **Time Trends** | | |
| View Own Metrics | ✅ | ✅ |
| View Team Metrics | ✅ | ✅ |
| **Insights** | | |
| Generate Insights | ✅ | ✅ |
| Send Insights Email | ✅ | ❌ |
| **Capacity** | | |
| View Capacity | ✅ | ✅ |
| **Audit Logs** | | |
| View Audit Logs | ✅ | ❌ |

---

## 📊 Metrics & Calculations

### Utilization Percentage

Measures how much of available time is spent on tracked work.

```
Utilization % = (Total Time Spent / Total Working Hours) × 100

Example:
- Time Spent on Jira Issues: 140 hours
- Total Working Hours: 168 hours (21 days × 8 hours)
- Utilization: (140 / 168) × 100 = 83.33%
```

**Interpretation:**
- **< 70%:** May indicate under-utilization or significant non-tracked work
- **70-85%:** Healthy range, allows for meetings, reviews, and planning
- **85-95%:** High productivity, ensure work-life balance
- **> 95%:** Potentially unsustainable, risk of burnout

---

### Story Burn Rate

Measures story points delivered per hour worked.

```
Story Burn Rate = Total Story Points / Total Time Spent

Example:
- Story Points Completed: 89
- Time Spent: 140 hours
- Burn Rate: 89 / 140 = 0.64 points/hour
```

**Use Cases:**
- Capacity planning: Estimate future story point capacity
- Team comparison: Compare productivity across teams
- Trend analysis: Track improvement over time

**Note:** Burn rate varies by:
- Story point complexity scale used
- Team experience and domain knowledge
- Type of work (new features vs. maintenance)

---

### Time Actual vs Original Estimate

Compares actual time spent to original estimates.

```
Time Ratio = Total Time Spent / Total Original Estimate

Example:
- Time Spent: 140 hours
- Original Estimate: 160 hours
- Ratio: 140 / 160 = 0.875 (87.5% of estimate)
```

**Interpretation:**
- **< 0.7:** Significantly faster than estimated (over-estimated or skilled work)
- **0.7-1.0:** Good estimation accuracy, completed under estimate
- **1.0-1.3:** Slight overrun, acceptable range
- **> 1.3:** Significant overrun, review estimation process

---

### Working Hours Calculation

Calculates actual available working hours considering all factors.

```
Working Hours = Business Days × Hours Per Day - Holiday Hours - PTO Hours

Example (February 2025, US location):
- Calendar Days: 28
- Weekends: 8 days
- Business Days: 20 days
- Presidents' Day Holiday: 1 day (8 hours)
- Team Member PTO: 5 days (40 hours)
- Working Hours: (20 × 8) - 8 - 40 = 112 hours
```

**Components:**

1. **Business Days:** Monday-Friday only
2. **Holiday Hours:** From Holiday model, location-specific, supports partial days
3. **PTO Hours:** From approved PTO requests, calculated from duration field

---

### Capacity Calculation

Estimates future team capacity based on available hours and historical performance.

```
Step 1: Calculate Available Hours
Available Hours = (Business Days × 8) - Holiday Hours - Scheduled PTO Hours

Step 2: Apply Utilization Target
Effective Hours = Available Hours × Utilization Target (typically 85%)

Step 3: Estimate Story Points
Story Point Capacity = Effective Hours × Historical Burn Rate

Example:
- Business Days in March: 21
- Available Hours: (21 × 8) - 16 (holidays) - 40 (PTO) = 112 hours
- Effective Hours: 112 × 0.85 = 95.2 hours
- Historical Burn Rate: 1.5 points/hour
- Estimated Capacity: 95.2 × 1.5 = 142.8 ≈ 143 story points
```

**Factors Affecting Capacity:**
- ✅ Team size and composition
- ✅ Scheduled holidays (location-specific)
- ✅ Approved PTO requests
- ✅ Utilization target (meetings, reviews, etc.)
- ✅ Historical burn rate (team velocity)

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- tests/unit/models/User.test.js

# Run tests in watch mode
npm test -- --watch

# Run only unit tests
npm test -- --testPathPattern=unit

# Run only integration tests
npm test -- --testPathPattern=integration
```

### Test Structure

```
tests/
├── unit/                          # Unit tests
│   ├── models/
│   │   ├── User.test.js
│   │   ├── Team.test.js
│   │   └── PTO.test.js
│   ├── controllers/
│   │   ├── authController.test.js
│   │   └── teamsController.test.js
│   ├── services/
│   │   ├── jiraService.test.js
│   │   ├── dateService.test.js
│   │   └── capacityCalculator.test.js
│   └── middleware/
│       ├── auth.test.js
│       └── validation.test.js
│
└── integration/                   # Integration tests
    ├── auth.test.js              # Auth flow tests
    ├── teams.test.js             # Team management tests
    ├── pto.test.js               # PTO workflow tests
    └── capacity.test.js          # Capacity calculation tests
```

### Writing Tests

**Unit Test Example:**

```javascript
import { calculateUtilization } from '../services/metricsService';

describe('MetricsService', () => {
  describe('calculateUtilization', () => {
    it('should calculate utilization percentage correctly', () => {
      const timeSpent = 140;
      const workingHours = 168;
      
      const result = calculateUtilization(timeSpent, workingHours);
      
      expect(result).toBeCloseTo(83.33, 2);
    });

    it('should return 0 for zero working hours', () => {
      const result = calculateUtilization(0, 0);
      expect(result).toBe(0);
    });
  });
});
```

**Integration Test Example:**

```javascript
import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@company.com',
          password: 'TestPass123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@company.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### Test Coverage Goals

- **Overall Coverage:** > 80%
- **Controllers:** > 85%
- **Services:** > 90%
- **Models:** > 95%
- **Middleware:** > 85%

---

## 🚀 Deployment

### Environment-Specific Configuration

**Development:**
```env
NODE_ENV=development
LOG_LEVEL=debug
```

**Staging:**
```env
NODE_ENV=staging
LOG_LEVEL=info
```

**Production:**
```env
NODE_ENV=production
LOG_LEVEL=error
RATE_LIMIT=50
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (256-bit minimum)
- [ ] Configure production MongoDB URI (Atlas or dedicated server)
- [ ] Enable HTTPS (configure reverse proxy)
- [ ] Set appropriate `RATE_LIMIT`
- [ ] Configure SMTP for email notifications
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up automated backups
- [ ] Review and restrict CORS settings
- [ ] Enable security headers (Helmet configured)
- [ ] Set up CDN for static assets (if any)

### Deployment Methods

#### 1. PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name team-api

# Enable startup script
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs team-api

# Restart
pm2 restart team-api

# Stop
pm2 stop team-api
```

**PM2 Ecosystem File (ecosystem.config.js):**

```javascript
module.exports = {
  apps: [{
    name: 'team-api',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
```

Start with ecosystem file:
```bash
pm2 start ecosystem.config.js
```

---

#### 2. Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY backend .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  api:
    build: .
    container_name: team-api
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/team-management
    env_file:
      - ../.env
    depends_on:
      - mongo
    restart: unless-stopped
    networks:
      - team-network

  mongo:
    image: mongo:6
    container_name: team-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped
    networks:
      - team-network

volumes:
  mongo-data:

networks:
  team-network:
    driver: bridge
```

**Build and run:**

```bash
# Build image
docker build -t team-api .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

---

#### 3. Cloud Deployment (AWS/Azure/GCP)

**Example: AWS Elastic Beanstalk**

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production-env

# Deploy
eb deploy

# View logs
eb logs

# SSH into instance
eb ssh
```

---

### Monitoring & Logging

#### Application Monitoring

**New Relic Integration:**

```bash
npm install newrelic

# Add to start of server.js
require('newrelic');
```

**Datadog Integration:**

```bash
npm install dd-trace

# Add to start of server.js
require('dd-trace').init();
```

#### Log Aggregation

**ELK Stack (Elasticsearch, Logstash, Kibana):**

Configure Winston to send logs to Logstash:

```javascript
import winston from 'winston';
import LogstashTransport from 'winston-logstash-transport';

const logger = winston.createLogger({
  transports: [
    new LogstashTransport({
      host: 'logstash.company.com',
      port: 5000
    })
  ]
});
```

**CloudWatch Logs (AWS):**

```bash
npm install winston-cloudwatch
```

---

### Performance Optimization

1. **Database Indexes**
```javascript
// Ensure indexes are created
db.users.createIndex({ email: 1 });
db.teams.createIndex({ teamId: 1 });
db.ptos.createIndex({ userId: 1, status: 1 });
db.holidays.createIndex({ date: 1, location: 1 });
```

2. **Redis Caching** (Future Enhancement)
```javascript
// Cache Jira query results
const cached = await redis.get(`jira:${teamId}:${startDate}:${endDate}`);
if (cached) return JSON.parse(cached);

const data = await jiraService.searchIssues(jql);
await redis.setex(`jira:${teamId}:${startDate}:${endDate}`, 3600, JSON.stringify(data));
```

3. **Query Optimization**
```javascript
// Use lean() for read-only queries
const teams = await Team.find().lean();

// Select only needed fields
const users = await User.find().select('firstName lastName email');

// Populate only necessary fields
const team = await Team.findById(id).populate('members', 'firstName lastName');
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Error:**
```
MongooseError: Failed to connect to MongoDB
```

**Solutions:**
```bash
# Check if MongoDB is running
mongosh

# Check connection string
# Local: mongodb://localhost:27017/team-management
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/team-management

# Verify credentials and network access
# For Atlas: Add your IP to whitelist in Atlas dashboard
```

---

#### 2. JWT Token Invalid

**Error:**
```
{"success":false,"message":"Invalid or expired token"}
```

**Solutions:**
- Check if token is properly formatted in Authorization header
- Verify JWT_SECRET matches across all instances
- Ensure token hasn't expired (check `exp` claim)
- Clear old tokens if `passwordChangedAt` was updated

```bash
# Decode JWT to inspect (use jwt.io)
# Or use CLI tool:
echo "YOUR_TOKEN" | cut -d. -f2 | base64 -d | jq
```

---

#### 3. Jira API Connection Failed

**Error:**
```
{"success":false,"message":"Failed to execute Jira query: 401 Unauthorized"}
```

**Solutions:**
```bash
# Test Jira credentials manually
curl -u your-email@company.com:your-api-token \
  https://your-domain.atlassian.net/rest/api/3/myself

# Verify environment variables
echo $JIRA_EMAIL
echo $JIRA_BASE_URL
# Don't echo API token for security

# Generate new API token if needed:
# https://id.atlassian.com/manage-profile/security/api-tokens
```

---

#### 4. Ollama Connection Failed

**Error:**
```
{"message":"Ollama AI service is not available - AI features will be disabled"}
```

**Solutions:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull required model
ollama pull llama3.2

# Verify model is available
ollama list

# Check Ollama URL in .env
# OLLAMA_BASE_URL=http://localhost:11434
```

**Note:** AI features gracefully degrade if Ollama is unavailable. The application continues to function with basic summaries.

---

#### 5. Email Sending Failed

**Error:**
```
{"success":false,"message":"Failed to send email"}
```

**Solutions:**

**For Gmail:**
```bash
# 1. Enable 2-factor authentication
# 2. Generate app-specific password:
#    https://myaccount.google.com/apppasswords
# 3. Use app password in SMTP_PASS

# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

**For Other SMTP Servers:**
- Verify SMTP host and port
- Check if firewall blocks SMTP ports
- Ensure SMTP credentials are correct
- Try different secure/non-secure settings

---

#### 6. High Memory Usage

**Issue:** Application consuming too much memory

**Solutions:**

```bash
# Monitor memory usage
pm2 monit

# Increase max memory restart threshold
pm2 start server.js --max-memory-restart 2G

# Profile memory usage
node --inspect server.js
# Then use Chrome DevTools Memory Profiler

# Common causes:
# - Large Jira query results (use pagination)
# - Memory leaks in services
# - Too many concurrent requests
```

**Optimization:**
```javascript
// Limit query results
const issues = await jiraService.searchIssues({
  jql: query,
  maxResults: 100 // Don't fetch thousands at once
});

// Use streaming for large datasets
// Clear large objects after use
```

---

#### 7. Slow API Response Times

**Issue:** API endpoints responding slowly

**Debugging:**

```bash
# Enable debug logging
LOG_LEVEL=debug npm start

# Check MongoDB slow queries
db.setProfilingLevel(2)
db.system.profile.find().sort({millis:-1}).limit(5).pretty()

# Monitor request times
# Check logs/combined.log for response times

# Use APM tool (New Relic, Datadog)
```

**Common Solutions:**
- Add database indexes
- Optimize Mongoose queries (use lean(), select specific fields)
- Implement caching for expensive operations
- Use pagination for large result sets
- Optimize Jira API calls (reduce fields requested)

---

### Debug Mode

Enable comprehensive logging:

```bash
# Start with debug logging
LOG_LEVEL=debug npm run dev

# Or set in .env
LOG_LEVEL=debug
```

Check logs:
```bash
# View combined logs
tail -f logs/combined.log

# View error logs only
tail -f logs/error.log

# Search logs
grep "error" logs/combined.log
grep "jira" logs/combined.log
```

---

### Health Checks

**Endpoint Health Check:**
```bash
curl http://localhost:5000/health
```

**Database Health:**
```bash
curl http://localhost:5000/api/health/database
```

**External Services Health:**
```bash
curl http://localhost:5000/api/health/services
```

---

## 📚 Additional Resources

### Official Documentation

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Jira REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Tutorials & Guides

- [RESTful API Design](https://restfulapi.net/)
- [MongoDB Schema Design](https://www.mongodb.com/docs/manual/core/data-model-design/)
- [JWT Authentication Tutorial](https://jwt.io/introduction)
- [Winston Logging Guide](https://github.com/winstonjs/winston)
- [Joi Validation Examples](https://joi.dev/api/)

### Tools & Utilities

- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - MongoDB GUI
- [Robo 3T](https://robomongo.org/) - MongoDB client
- [PM2 Dashboard](https://pm2.keymetrics.io/) - Process monitoring
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - API documentation (see swagger.yaml)

---

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone**
```bash
git clone <your-fork-url>
cd backend
```

2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Changes**
- Follow existing code style
- Add tests for new features
- Update documentation

4. **Test**
```bash
npm test
npm run lint
```

5. **Commit**
```bash
git add .
git commit -m "Add amazing feature"
```

6. **Push & Create PR**
```bash
git push origin feature/amazing-feature
```

### Code Style Guidelines

- Use ES6+ features (arrow functions, destructuring, async/await)
- Follow ESLint configuration
- Write descriptive variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused (< 50 lines)
- Use meaningful commit messages

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation updated (if applicable)
- [ ] No console.logs (use logger instead)
- [ ] Environment variables added to .env.example
- [ ] Breaking changes documented

---

## 📝 License

MIT License

Copyright (c) 2025 Team Management

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 Support

For questions, issues, or feature requests:

- **Documentation:** Check this README and `/docs` folder
- **Issues:** Open an issue on GitHub
- **Security:** Email security@company.com for security concerns

---

**Built with ❤️ by the Team Management Development Team**

*Last Updated: October 24, 2025*
*Version: 1.0.0*

---

## 📌 Quick Reference

### Important URLs

```
API Base URL:        http://localhost:5000/api
Health Check:        http://localhost:5000/health
Swagger Docs:        http://localhost:5000/api-docs (see swagger.yaml)
MongoDB URI:         mongodb://localhost:27017/team-management
Jira API:            https://your-domain.atlassian.net/rest/api/3
Ollama API:          http://localhost:11434
```

### Environment Files

```
.env                 - Your actual configuration (DO NOT COMMIT)
.env.example         - Template with all variables
.env.development     - Development overrides (optional)
.env.production      - Production overrides (optional)
```

### Key Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run linter
pm2 start server.js  # Start with PM2
docker-compose up    # Start with Docker
```

---