# Team Management & Capacity Planning - Frontend

> React-based web application for team management, capacity planning, and performance analytics with Material-UI design.

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-5.0.8-purple.svg)](https://vitejs.dev/)
[![Material-UI](https://img.shields.io/badge/MUI-5.15.0-blue.svg)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/redux--toolkit-2.0.1-purple.svg)](https://redux-toolkit.js.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Application Routes](#application-routes)
- [Components](#components)
- [State Management](#state-management)
- [API Services](#api-services)
- [Custom Hooks](#custom-hooks)
- [Utilities](#utilities)
- [Build & Deployment](#build--deployment)

---

## 🎯 Overview

A modern React application built with Vite for managing software development teams, tracking capacity, analyzing performance metrics, and planning future workload. The application integrates with the backend API to provide real-time insights into team performance, PTO management, and capacity forecasting.

### Key Capabilities

- ✅ **Team Performance Analytics** - View team and individual metrics with interactive charts
- ✅ **Capacity Planning** - Calculate future capacity considering holidays and PTO
- ✅ **PTO Management** - Request and track paid time off
- ✅ **Holiday Management** - Manage company holidays with flexible hours
- ✅ **JQL Query Management** - Configure Jira queries per team
- ✅ **AI-Powered Insights** - View AI-generated team performance summaries
- ✅ **User Management** - Admin interface for managing users and teams
- ✅ **Audit Logs** - View system audit trail (admin only)
- ✅ **Distribution Lists** - Manage email distribution lists

---

## ✨ Features

### Core Features

- **Modern React** - Built with React 18.2 and functional components
- **Vite Build Tool** - Lightning-fast development and optimized production builds
- **Material-UI Design** - Consistent, professional UI with MUI components
- **Redux State Management** - Centralized state with Redux Toolkit
- **React Router** - Client-side routing with protected routes
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **JWT Authentication** - Secure authentication with token refresh
- **Role-Based Access** - Admin and Viewer role support
- **Real-Time Updates** - Live data from backend API
- **Interactive Charts** - Recharts integration for data visualization

### Business Features

- **Time Trend Analysis** - View associate and team performance over time
- **Capacity Forecasting** - Plan future sprints with capacity calculations
- **Teamwork Insights** - AI-generated summaries of team performance
- **Holiday Calendar** - Manage company and location-specific holidays
- **PTO Workflow** - Complete PTO request and approval interface
- **JQL Management** - Create and edit Jira queries per team
- **User Administration** - Manage users, teams, and permissions
- **Audit Trail** - View system changes and user actions
- **Distribution Lists** - Create email lists for team communications

---

## 🛠 Technology Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.2.0 | UI library |
| **Build Tool** | Vite | 5.0.8 | Development server & bundler |
| **Routing** | React Router DOM | 6.20.1 | Client-side routing |
| **State Management** | Redux Toolkit | 2.0.1 | Global state management |
| **UI Framework** | Material-UI (MUI) | 5.15.0 | Component library |
| **HTTP Client** | Axios | 1.6.2 | API requests |
| **Charts** | Recharts | 2.15.4 | Data visualization |
| **Date Handling** | date-fns | 2.30.0 | Date manipulation |
| **Notifications** | Notistack | 3.0.1 | Toast notifications |
| **Code Editor** | Monaco Editor React | 4.7.0 | JQL query editor |
| **Utilities** | Lodash | 4.17.21 | Utility functions |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **Vite Plugin React** | Fast refresh for React |

---

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
├── src/
│   ├── components/                  # React components
│   │   ├── Common/                  # Shared components
│   │   │   ├── ConfirmDialog.jsx    # Confirmation dialog
│   │   │   └── Loading.jsx          # Loading spinner
│   │   │
│   │   ├── Layout/                  # Layout components
│   │   │   ├── MainLayout.jsx       # Main app layout with navigation
│   │   │   └── Header.jsx           # App header/navbar
│   │   │
│   │   ├── Teams/                   # Team management components
│   │   │   ├── TeamsList.jsx
│   │   │   ├── TeamModal.jsx
│   │   │   ├── MemberCard.jsx
│   │   │   └── MemberDetailDialog.jsx
│   │   │
│   │   ├── TimeTrend/               # Time trend analysis components
│   │   │   ├── TeamView.jsx
│   │   │   ├── AssociateView.jsx
│   │   │   ├── IndividualView.jsx
│   │   │   └── MetricCard.jsx
│   │   │
│   │   ├── Capacity/                # Capacity planning components
│   │   │   ├── CapacityView.jsx
│   │   │   ├── CapacityChart.jsx
│   │   │   └── CapacityMetricCards.jsx
│   │   │
│   │   ├── Insights/                # AI insights components
│   │   │   ├── InsightsView.jsx
│   │   │   ├── MemberInsightCard.jsx
│   │   │   └── EmailDialog.jsx
│   │   │
│   │   ├── PTO/                     # PTO management components
│   │   │   ├── PTOView.jsx
│   │   │   ├── PTORequestModal.jsx
│   │   │   └── PTOCard.jsx
│   │   │
│   │   ├── Holidays/                # Holiday management components
│   │   │   ├── HolidaysList.jsx
│   │   │   └── HolidayModal.jsx
│   │   │
│   │   ├── JQLQueries/              # JQL query management
│   │   │   ├── JQLPage.jsx
│   │   │   └── JQLModal.jsx
│   │   │
│   │   ├── Users/                   # User management (admin)
│   │   │   ├── UsersList.jsx
│   │   │   └── UserModal.jsx
│   │   │
│   │   ├── AuditLogs/               # Audit log viewer (admin)
│   │   │   └── AuditLogsList.jsx
│   │   │
│   │   └── DistributionLists/       # Email distribution lists
│   │       ├── DistributionListsPage.jsx
│   │       └── DistributionListModal.jsx
│   │
│   ├── pages/                       # Page components
│   │   ├── LandingPage.jsx          # Home/dashboard page
│   │   └── LoginPage.jsx            # Login page
│   │
│   ├── services/                    # API services
│   │   ├── api.js                   # Axios instance configuration
│   │   ├── authService.js           # Authentication API
│   │   ├── teamService.js           # Team management API
│   │   ├── userService.js           # User management API
│   │   ├── holidayService.js        # Holiday management API
│   │   ├── ptoService.js            # PTO management API
│   │   ├── jiraQueryService.js      # JQL query management API
│   │   ├── timeTrendService.js      # Time trend analytics API
│   │   ├── capacityService.js       # Capacity planning API
│   │   ├── insightsService.js       # AI insights API
│   │   ├── distributionListService.js # Distribution lists API
│   │   └── constantsService.js      # Constants API
│   │
│   ├── store/                       # Redux store
│   │   ├── store.js                 # Store configuration
│   │   └── slices/
│   │       ├── authSlice.js         # Authentication state
│   │       ├── dataSlice.js         # Application data state
│   │       └── uiSlice.js           # UI state (modals, loading, etc.)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.jsx              # Authentication hook
│   │   ├── useConstants.jsx         # Constants context hook
│   │   ├── useFetch.jsx             # Data fetching hook
│   │   ├── useDebounce.jsx          # Debounce hook
│   │   ├── useLocalStorage.jsx      # Local storage hook
│   │   └── usePageReset.jsx         # Page reset hook
│   │
│   ├── context/                     # React contexts
│   │   ├── AuthContext.jsx          # Authentication context provider
│   │   └── ConstantsContext.jsx     # Application constants provider
│   │
│   ├── utils/                       # Utility functions
│   │   ├── formatters.js            # Formatting utilities
│   │   ├── dateHelpers.js           # Date calculation helpers
│   │   └── validators.js            # Validation utilities
│   │
│   ├── styles/                      # Global styles
│   │   └── theme.js                 # MUI theme configuration
│   │
│   ├── App.jsx                      # Main App component with routes
│   └── main.jsx                     # Application entry point
│
├── .eslintrc.cjs                    # ESLint configuration
├── vite.config.js                   # Vite configuration
├── package.json                     # Dependencies and scripts
├── index.html                       # HTML entry point
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Backend API** running on `http://localhost:5000`

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Name
VITE_APP_NAME=Team Management
```

3. **Start development server:**

```bash
npm run dev
```

Application will open at `http://localhost:3000`

---

## 📜 Available Scripts

### Development

```bash
# Start development server
npm run dev

# Alternative start command
npm start
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

---

## 🌍 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | - | Backend API base URL (e.g., `http://localhost:5000/api`) |
| `VITE_APP_NAME` | No | `Team Management` | Application name displayed in UI |

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the application via `import.meta.env`.

---

## 🛣️ Application Routes

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | `LoginPage` | User login page |

### Protected Routes (Requires Authentication)

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | `LandingPage` | All | Dashboard/home page |
| `/home` | `LandingPage` | All | Dashboard (alias) |
| `/time-trend/team` | `TeamView` | All | Team time trend analytics |
| `/time-trend/associate` | `AssociateView` | All | Associate time trend analytics |
| `/future-capacity` | `CapacityView` | All | Future capacity planning |
| `/teamwork-insights` | `InsightsView` | All | AI-powered team insights |
| `/team-pto` | `PTOView` | All | PTO requests and management |
| `/holidays` | `HolidaysList` | All | Holiday calendar |
| `/team-jqls` | `JQLPage` | All | JQL query management |
| `/manage-teams` | `TeamsList` | Admin | Team management |
| `/manage-users` | `UsersList` | Admin | User management |
| `/audit-logs` | `AuditLogsList` | Admin | Audit log viewer |
| `/distribution-lists` | `DistributionListsPage` | All | Email distribution lists |

### Fallback

| Path | Behavior | Description |
|------|----------|-------------|
| `*` | Redirect to `/` | Catches all undefined routes |

---

## 🎨 Components

### Layout Components

#### MainLayout
Main application layout with navigation drawer and header.

**Features:**
- Responsive navigation drawer
- User menu with logout
- Dynamic navigation based on user role
- Breadcrumb navigation

#### Header
Application header with user profile and menu.

**Features:**
- User avatar display
- Profile dropdown menu
- Logout functionality

---

### Common Components

#### Loading
Centered loading spinner for async operations.

**Props:**
- `fullScreen` (boolean) - Display as fullscreen overlay
- `message` (string) - Loading message text

#### ConfirmDialog
Reusable confirmation dialog for destructive actions.

**Props:**
- `open` (boolean) - Dialog visibility
- `title` (string) - Dialog title
- `message` (string) - Confirmation message
- `onConfirm` (function) - Callback on confirm
- `onCancel` (function) - Callback on cancel

---

### Time Trend Components

#### TeamView
Displays team performance metrics over a date range.

**Features:**
- Date range picker
- Team selector
- Performance metrics cards (utilization, burn rate, story points)
- Monthly breakdown chart
- Member performance table

#### AssociateView
Displays individual associate performance metrics.

**Features:**
- Associate selector
- Date range picker
- Performance metrics
- Issue breakdown by type and status
- Time spent vs. estimated chart

#### IndividualView
Detailed individual performance view with trends.

**Features:**
- Performance trend analysis
- Issue type distribution
- Story points tracking
- Time utilization breakdown

#### MetricCard
Reusable card component for displaying metrics.

**Props:**
- `title` (string) - Metric name
- `value` (number/string) - Metric value
- `icon` (component) - MUI icon
- `color` (string) - Card accent color

---

### Capacity Components

#### CapacityView
Future capacity planning interface.

**Features:**
- Date range selector
- Team selector
- Capacity calculation
- PTO and holiday consideration
- Member availability breakdown
- Story point estimation

#### CapacityChart
Interactive bar chart for capacity visualization.

**Features:**
- Available hours vs. working hours
- PTO and holiday breakdown
- Custom tooltips
- Responsive design

#### CapacityMetricCards
Grid of metric cards showing capacity summary.

**Displays:**
- Total working hours
- Holiday hours
- PTO hours
- Estimated story points

---

### Insights Components

#### InsightsView
AI-powered team insights interface.

**Features:**
- Date range selector
- Team selector
- Generate insights button
- AI summaries for each team member
- Team summary
- Export to HTML
- Send via email

#### MemberInsightCard
Card displaying AI-generated insights for a team member.

**Props:**
- `member` (object) - Member data with metrics and AI summary
- `expanded` (boolean) - Card expansion state

#### EmailDialog
Dialog for sending insights via email.

**Features:**
- Recipient email input
- Subject customization
- Attachment options
- Send functionality

---

### PTO Components

#### PTOView
PTO request and management interface.

**Features:**
- PTO requests table
- Filter by status (pending, approved, rejected)
- Create new PTO request
- Approve/reject requests (admin)
- Delete own pending requests

#### PTORequestModal
Modal for creating/editing PTO requests.

**Fields:**
- Start date
- End date
- PTO type (vacation, sick, personal, other)
- Reason
- Notes

#### PTOCard
Card component for displaying a PTO request.

**Displays:**
- PTO dates and duration
- Type and status
- Requester information
- Approval information (if approved)
- Action buttons (approve/reject for admin)

---

### Holiday Components

#### HolidaysList
Holiday calendar management interface.

**Features:**
- Holidays table with filters
- Location filter (US, India, Global)
- Year and month filters
- Create/edit/delete holidays (admin)
- Recurring holiday support
- Flexible hours (full-day, half-day, custom)

#### HolidayModal
Modal for creating/editing holidays.

**Fields:**
- Holiday name
- Date
- Location
- Hours (8 = full day, 4 = half day, custom)
- Description
- Recurring checkbox

---

### JQL Components

#### JQLPage
JQL query management interface.

**Features:**
- Team selector
- Query list by type (hist_query, workinsights_query, etc.)
- Create/edit/delete queries (admin)
- Monaco code editor for JQL
- Query validation

#### JQLModal
Modal for creating/editing JQL queries.

**Features:**
- JQL key dropdown
- Monaco code editor
- Syntax highlighting
- Query description field

---

### Team Components

#### TeamsList
Team management interface (admin).

**Features:**
- Teams table
- Create/edit/delete teams
- View team members
- Add/remove members
- Jira project key configuration

#### TeamModal
Modal for creating/editing teams.

**Fields:**
- Team ID
- Team name
- Description
- Location
- Jira project key

#### MemberCard
Card displaying team member information.

**Displays:**
- Member name and email
- Designation
- Jira account ID
- Join date

#### MemberDetailDialog
Dialog for viewing/editing team member details.

**Features:**
- View member profile
- Edit designation
- Update Jira account ID
- Remove from team (admin)

---

### User Components

#### UsersList
User management interface (admin only).

**Features:**
- Users table
- Create/edit/delete users
- Role management (admin/viewer)
- Activate/deactivate accounts
- Password reset

#### UserModal
Modal for creating/editing users.

**Fields:**
- Email
- First name
- Last name
- Role
- Password (create only)

---

### Audit Log Components

#### AuditLogsList
Audit log viewer (admin only).

**Features:**
- Audit logs table with filters
- Filter by user, action, resource type, status
- Date range filter
- Pagination
- View change details

---

### Distribution List Components

#### DistributionListsPage
Email distribution list management.

**Features:**
- Distribution lists table
- Create/edit/delete lists
- Add/remove email addresses
- Associate with teams

#### DistributionListModal
Modal for creating/editing distribution lists.

**Fields:**
- List name
- Description
- Email addresses (multi-input)
- Associated teams

---

## 🏪 State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: {
      id: string,
      email: string,
      firstName: string,
      lastName: string,
      role: 'admin' | 'viewer',
      teams: [string]
    },
    token: string,
    isAuthenticated: boolean,
    loading: boolean
  },
  
  data: {
    teams: [Team],
    users: [User],
    holidays: [Holiday],
    ptos: [PTO],
    jqlQueries: [JiraQuery],
    distributionLists: [DistributionList],
    loading: boolean,
    error: string | null
  },
  
  ui: {
    modals: {
      teamModal: boolean,
      ptoModal: boolean,
      holidayModal: boolean,
      // ... other modals
    },
    selectedTeam: string | null,
    selectedUser: string | null,
    dateRange: {
      startDate: Date,
      endDate: Date
    },
    notifications: [Notification]
  }
}
```

---

### Redux Slices

#### authSlice
Manages authentication state.

**Actions:**
- `login` - Set user and token
- `logout` - Clear authentication state
- `updateUser` - Update user profile
- `setToken` - Update JWT token

---

#### dataSlice
Manages application data.

**Actions:**
- `setTeams` - Set teams list
- `addTeam` - Add new team
- `updateTeam` - Update team
- `deleteTeam` - Remove team
- `setUsers` - Set users list
- `addUser` - Add new user
- `updateUser` - Update user
- `deleteUser` - Remove user
- `setHolidays` - Set holidays list
- `addHoliday` - Add holiday
- `updateHoliday` - Update holiday
- `deleteHoliday` - Remove holiday
- `setPTOs` - Set PTO requests
- `addPTO` - Add PTO request
- `updatePTO` - Update PTO
- `deletePTO` - Remove PTO
- `setJQLQueries` - Set JQL queries
- `addJQLQuery` - Add query
- `updateJQLQuery` - Update query
- `deleteJQLQuery` - Remove query
- `setDistributionLists` - Set lists
- `addDistributionList` - Add list
- `updateDistributionList` - Update list
- `deleteDistributionList` - Remove list
- `setLoading` - Set loading state
- `setError` - Set error message

---

#### uiSlice
Manages UI state.

**Actions:**
- `openModal` - Open a modal by name
- `closeModal` - Close a modal by name
- `setSelectedTeam` - Set active team
- `setSelectedUser` - Set active user
- `setDateRange` - Set date range filter
- `showNotification` - Show toast notification
- `hideNotification` - Hide notification

---

## 🔌 API Services

All API services use Axios with JWT token authentication.

### Base Configuration (api.js)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### authService.js

Authentication API calls.

**Methods:**
- `login(email, password)` - Authenticate user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user profile
- `changePassword(currentPassword, newPassword)` - Change password
- `refreshToken(refreshToken)` - Refresh JWT token

---

### teamService.js

Team management API calls.

**Methods:**
- `getTeams(filters)` - Get all teams
- `getTeamById(id)` - Get team by ID
- `createTeam(teamData)` - Create new team
- `updateTeam(id, teamData)` - Update team
- `deleteTeam(id)` - Delete team
- `getTeamMembers(teamId)` - Get team members
- `addTeamMember(teamId, memberData)` - Add member to team
- `updateTeamMember(teamId, memberId, memberData)` - Update member
- `removeTeamMember(teamId, memberId)` - Remove member from team

---

### userService.js

User management API calls.

**Methods:**
- `getUsers(filters)` - Get all users
- `getUserById(id)` - Get user by ID
- `createUser(userData)` - Create new user
- `updateUser(id, userData)` - Update user
- `deleteUser(id)` - Delete user

---

### holidayService.js

Holiday management API calls.

**Methods:**
- `getHolidays(filters)` - Get holidays with filters
- `getHolidayById(id)` - Get holiday by ID
- `createHoliday(holidayData)` - Create new holiday
- `updateHoliday(id, holidayData)` - Update holiday
- `deleteHoliday(id)` - Delete holiday

---

### ptoService.js

PTO management API calls.

**Methods:**
- `getPTOs(filters)` - Get PTO requests with filters
- `getPTOById(id)` - Get PTO by ID
- `createPTO(ptoData)` - Create new PTO request
- `updatePTO(id, ptoData)` - Update PTO request
- `deletePTO(id)` - Delete PTO request
- `approvePTO(id, notes)` - Approve PTO request (admin)
- `rejectPTO(id, reason)` - Reject PTO request (admin)

---

### jiraQueryService.js

JQL query management API calls.

**Methods:**
- `getQueriesByTeam(teamId)` - Get all JQL queries for a team
- `getQueryById(id)` - Get JQL query by ID
- `createQuery(queryData)` - Create new JQL query
- `updateQuery(id, queryData)` - Update JQL query
- `deleteQuery(id)` - Delete JQL query

---

### timeTrendService.js

Time trend analytics API calls.

**Methods:**
- `getAssociateMetrics(teamId, userId, startDate, endDate)` - Get associate metrics
- `getTeamMetrics(teamId, startDate, endDate)` - Get team metrics
- `getTeamMonthlyMetrics(teamId, year, month)` - Get monthly team metrics
- `getIndividualMetrics(userId, startDate, endDate)` - Get individual performance

---

### capacityService.js

Capacity planning API calls.

**Methods:**
- `calculateCapacity(teamId, startDate, endDate)` - Calculate team capacity
- `getTeamCapacity(teamId, startDate, endDate)` - Get capacity summary
- `getCapacityAnalytics(teamId, months)` - Get capacity trends

---

### insightsService.js

AI insights API calls.

**Methods:**
- `generateInsights(teamId, startDate, endDate)` - Generate AI insights
- `exportInsightsHTML(teamId, startDate, endDate)` - Export as HTML
- `sendInsightsEmail(teamId, startDate, endDate, recipients)` - Send via email

---

### distributionListService.js

Distribution list API calls.

**Methods:**
- `getDistributionLists()` - Get all distribution lists
- `getDistributionListById(id)` - Get list by ID
- `createDistributionList(listData)` - Create new list
- `updateDistributionList(id, listData)` - Update list
- `deleteDistributionList(id)` - Delete list

---

### constantsService.js

Application constants API calls.

**Methods:**
- `getConstants()` - Get application constants (roles, statuses, locations, etc.)

---

## 🪝 Custom Hooks

### useAuth()

Access authentication context.

```javascript
import { useAuth } from '@hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication state and methods
}
```

**Returns:**
- `user` - Current user object
- `token` - JWT token
- `isAuthenticated` - Boolean authentication status
- `login(email, password)` - Login function
- `logout()` - Logout function
- `updateUser(userData)` - Update user function

---

### useConstants()

Access application constants.

```javascript
import { useConstants } from '@hooks/useConstants';

function MyComponent() {
  const { USER_ROLES, PTO_TYPES, LOCATIONS } = useConstants();
  
  // Use constants
}
```

**Returns:**
- `USER_ROLES` - User role constants
- `PTO_TYPES` - PTO type constants
- `PTO_STATUS` - PTO status constants
- `LOCATIONS` - Location constants
- `ISSUE_STATUS` - Jira issue status constants
- `EMAIL_TYPES` - Email type constants
- `loading` - Loading state
- `error` - Error state

---

### useFetch(url, options)

Fetch data from API with loading and error handling.

```javascript
import { useFetch } from '@hooks/useFetch';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch('/api/teams');
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

**Parameters:**
- `url` (string) - API endpoint
- `options` (object) - Fetch options

**Returns:**
- `data` - Response data
- `loading` - Loading state
- `error` - Error message
- `refetch()` - Refetch function

---

### useDebounce(value, delay)

Debounce a value.

```javascript
import { useDebounce } from '@hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    // API call with debouncedSearch
  }, [debouncedSearch]);
}
```

**Parameters:**
- `value` (any) - Value to debounce
- `delay` (number) - Delay in milliseconds

**Returns:**
- Debounced value

---

### useLocalStorage(key, initialValue)

Persist state in local storage.

```javascript
import { useLocalStorage } from '@hooks/useLocalStorage';

function MyComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  // theme is synced with localStorage
}
```

**Parameters:**
- `key` (string) - Local storage key
- `initialValue` (any) - Default value

**Returns:**
- `[value, setValue]` - State value and setter function

---

### usePageReset()

Reset page state when component unmounts.

```javascript
import { usePageReset } from '@hooks/usePageReset';

function MyComponent() {
  usePageReset(); // Resets pagination, filters, etc. on unmount
}
```

---

## 🔧 Utilities

### Formatters (utils/formatters.js)

**Functions:**
- `formatDate(date, format)` - Format date string
- `formatNumber(number, decimals)` - Format number with decimals
- `formatCurrency(amount)` - Format as currency
- `formatPercentage(value, decimals)` - Format as percentage
- `formatHours(hours)` - Format hours (e.g., "40h" or "5d")
- `formatStoryPoints(points)` - Format story points
- `formatUtilization(utilization)` - Format utilization percentage
- `formatBurnRate(rate)` - Format burn rate
- `formatFileSize(bytes)` - Format file size (KB, MB, GB)
- `formatName(firstName, lastName)` - Format full name
- `capitalizeFirst(string)` - Capitalize first letter

---

### Date Helpers (utils/dateHelpers.js)

**Functions:**
- `calculateWorkingDays(startDate, endDate)` - Calculate working days between dates
- `calculateWorkingHours(startDate, endDate, hoursPerDay)` - Calculate working hours
- `getDaysBetween(startDate, endDate)` - Get total days between dates
- `getCurrentYear()` - Get current year
- `getCurrentMonth()` - Get current month (1-12)
- `getMonthName(month)` - Get month name from number
- `isWeekend(date)` - Check if date is weekend
- `addDays(date, days)` - Add days to date
- `subtractDays(date, days)` - Subtract days from date
- `startOfMonth(date)` - Get start of month
- `endOfMonth(date)` - Get end of month
- `startOfWeek(date)` - Get start of week
- `endOfWeek(date)` - Get end of week

---

### Validators (utils/validators.js)

**Functions:**
- `isValidEmail(email)` - Validate email format
- `isValidPassword(password)` - Validate password strength
- `isValidDate(date)` - Validate date
- `isValidDateRange(startDate, endDate)` - Validate date range
- `isValidURL(url)` - Validate URL format
- `isValidNumber(value)` - Validate number
- `isEmpty(value)` - Check if value is empty

---

## 🎨 Theming

Material-UI theme configuration in `src/styles/theme.js`:

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink
    },
    error: {
      main: '#f44336', // Red
    },
    warning: {
      main: '#ff9800', // Orange
    },
    info: {
      main: '#2196f3', // Light blue
    },
    success: {
      main: '#4caf50', // Green
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase
        },
      },
    },
  },
});

export default theme;
```

---

## 🏗️ Build & Deployment

### Build Configuration

Vite is configured in `vite.config.js` with:

- **Development Server:** Port 3000 with API proxy to `http://localhost:5000`
- **Build Output:** `dist/` directory
- **Code Splitting:** Vendor chunks for React, MUI, Redux, Charts
- **Minification:** ESBuild for fast builds
- **Path Aliases:** `@`, `@components`, `@services`, `@hooks`, `@utils`, `@store`, `@styles`

---

### Development Build

```bash
npm run dev
```

**Features:**
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps
- API proxy to backend

---

### Production Build

```bash
npm run build
```

**Output:**
- Minified JavaScript and CSS
- Optimized assets
- Code splitting for better performance
- Build output in `dist/` directory

**Build Optimization:**
- Vendor chunk splitting
- Tree shaking
- Asset optimization
- Gzip-ready files

---

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally on port 3000.

---

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel, AWS S3)

```bash
npm run build
# Upload dist/ folder
```

**Environment Variables:**
- Set `VITE_API_URL` to production API URL

**SPA Routing:**
- Configure redirect rules for client-side routing

**Example Netlify `_redirects`:**
```
/*    /index.html   200
```

---

#### 2. Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY frontend .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Build and run:**
```bash
docker build -t team-frontend .
docker run -p 80:80 team-frontend
```

---

#### 3. Node.js Server (Express)

```bash
npm install -g serve
serve -s dist -l 3000
```

---

### Environment-Specific Builds

**Development:**
```bash
VITE_API_URL=http://localhost:5000/api npm run build
```

**Staging:**
```bash
VITE_API_URL=https://staging-api.company.com/api npm run build
```

**Production:**
```bash
VITE_API_URL=https://api.company.com/api npm run build
```

---

## 🔒 Security Considerations

1. **JWT Token Storage** - Tokens stored in localStorage (consider httpOnly cookies for production)
2. **API URL Validation** - Ensure `VITE_API_URL` points to trusted backend
3. **Environment Variables** - Never commit `.env` file with sensitive data
4. **Content Security Policy** - Configure CSP headers in production
5. **HTTPS** - Always use HTTPS in production
6. **XSS Prevention** - React escapes output by default
7. **CORS** - Backend must configure CORS for frontend domain

---

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Failed

**Error:** Network error or CORS issue

**Solution:**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Verify backend CORS configuration allows frontend origin

---

#### 2. Build Fails

**Error:** Build process fails

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

---

#### 3. Hot Reload Not Working

**Solution:**
- Restart dev server
- Check file watcher limits (Linux):
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

#### 4. Authentication Loop

**Issue:** Redirects to login repeatedly

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Check token expiration
- Verify backend returns valid JWT

---

#### 5. Slow Build Times

**Solution:**
- Update dependencies
- Disable source maps: Set `sourcemap: false` in `vite.config.js`
- Use `npm run build` instead of `npm run dev` for production

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)
- [Axios Documentation](https://axios-http.com/)

---

## 📝 License

MIT License

---

## 🎉 Summary

This frontend application provides a complete user interface for team management, capacity planning, and performance analytics. Built with modern React and Material-UI, it offers a responsive, intuitive experience for both administrators and team members.

**Key Features:**
- ✅ 50 React components
- ✅ 15 application routes
- ✅ 3 Redux slices
- ✅ 11 API services
- ✅ 6 custom hooks
- ✅ Material-UI design system
- ✅ Vite build tool for fast development
- ✅ JWT authentication
- ✅ Role-based access control

**Total Code:** 10,246 lines of production-ready React code.

---

*Built with ❤️ using React, Vite, and Material-UI*

*Last Updated: October 24, 2025*
*Version: 1.0.0*