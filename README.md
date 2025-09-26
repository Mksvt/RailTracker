# 🚂 RailTracker - Train Schedule Management System

Modern train schedule management system with administrative panel and real-time updates.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Development](#development)

## 🎯 Project Overview

RailTracker is a full-featured train schedule management system built with modern web technologies. The project includes both a client-side application for users and an administrative panel for data management.

### Key Features:

- 🎨 **Modern UI/UX** with dark theme
- 🔐 **Secure authentication** with JWT tokens
- 📊 **Administrative panel** for complete system management
- 🔍 **Advanced search** by stations, trains, and schedules
- 📱 **Responsive design** for all devices
- 🚀 **Real-time data updates**

## ⚡ Features

### For Users:

- View current train schedules
- Search trains by stations, numbers, and names
- Filter and sort schedules
- User registration and authentication

### For Administrators:

- **Station Management**: create, edit, delete stations
- **Train Management**: full CRUD for trains
- **Schedule Management**: create and edit schedules
- **User Management**: view and manage user accounts
- **Cascade delete protection** with informative messages

## 🛠 Tech Stack

### Backend:

- **NestJS** v11 - Node.js framework
- **TypeORM** - ORM for database operations
- **PostgreSQL** - relational database
- **JWT** - authentication and authorization
- **Passport** - authentication strategies
- **bcrypt** - password hashing
- **class-validator** - DTO validation

### Frontend:

- **Next.js** v14 (App Router) - React framework
- **TypeScript** - JavaScript with types
- **Tailwind CSS** - CSS framework
- **shadcn/ui** - UI components
- **Radix UI** - accessibility primitives
- **Axios** - HTTP client
- **React Hook Form** - form management

### DevOps:

- **Docker** - containerization
- **Docker Compose** - container orchestration

## 📁 Project Structure

```
train/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── entities/          # TypeORM entities
│   │   ├── profile/           # Profile management
│   │   ├── station/           # Station management
│   │   ├── train/             # Train management
│   │   ├── train-schedule/    # Schedule management
│   │   └── main.ts           # Entry point
│   ├── docker-compose.yml     # PostgreSQL container
│   └── package.json
│
├── frontend/                  # Next.js client
│   ├── app/                   # App Router pages
│   │   ├── admin/            # Administrative panel
│   │   ├── auth/             # Authentication pages
│   │   └── layout.tsx
│   ├── components/           # React components
│   │   ├── admin/           # Administrative components
│   │   ├── ui/              # UI components
│   │   └── modals/          # Modal windows
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities and API
│   └── package.json
│
└── README.md                 # This file
```

## 🚀 Installation and Setup

### Requirements:

- Node.js 18+
- npm or yarn
- Docker and Docker Compose
- PostgreSQL (or via Docker)

### 1. Clone the repository:

```bash
git clone <repository-url>
cd train
```

### 2. Backend Setup:

```bash
cd backend

# Install dependencies
npm install

# Start PostgreSQL via Docker
docker-compose up -d

# Setup environment variables
cp .env.example .env
# Edit .env file with your settings
```

### 3. Frontend Setup:

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local file
```

## 🏃 Running the Project

### Development Mode:

**Terminal 1 - Backend:**

```bash
cd backend
npm run start:dev
```

Backend will be available at http://localhost:3001

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will be available at http://localhost:3000

### Production Mode:

**Backend:**

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**

```bash
cd frontend
npm run build
npm start
```

## 📚 API Documentation

### Main Endpoints:

#### Authentication:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

#### Stations:

- `GET /api/stations` - List all stations
- `POST /api/stations` - Create station
- `PUT /api/stations/:id` - Edit station
- `DELETE /api/stations/:id` - Delete station

#### Trains:

- `GET /api/trains` - List all trains
- `POST /api/trains` - Create train
- `PUT /api/trains/:id` - Edit train
- `DELETE /api/trains/:id` - Delete train

#### Schedules:

- `GET /api/schedules?search=&sort=` - List schedules with search
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Edit schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Search and Filtering:

**Search works by:**

- Station names (departure/arrival)
- Train numbers
- Train names

**Example:**

```
GET /api/schedules?search=Kiev&sort=departure_time
```

## 🔧 Development

### Useful Commands:

**Backend:**

```bash
npm run start:dev     # Start with auto-reload
npm run test          # Run tests
npm run lint          # Lint code
```

**Frontend:**

```bash
npm run dev           # Start development
npm run build         # Build for production
npm run lint          # Lint code
```

### Architectural Decisions:

1. **JWT in cookies** - for server-side middleware access
2. **Modular architecture** - each resource in separate module
3. **DTO validation** - automatic input data validation
4. **Foreign key constraints** - database integrity checks
5. **Reusable UI components** - using shadcn/ui

### Database:

**Main Tables:**

- `users` - system users
- `stations` - railway stations
- `trains` - trains
- `train_schedules` - train schedules

**Relationships:**

- `train_schedules.train_id → trains.id`
- `train_schedules.departure_station_id → stations.id`
- `train_schedules.arrival_station_id → stations.id`

## 🔒 Security

- JWT tokens with short expiration time
- Password hashing with bcrypt
- CORS configuration
- All input data validation
- SQL injection protection via TypeORM

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is under private license.

## 📞 Contact

For questions and suggestions, please contact via GitHub Issues.

---

**Developed with ❤️ for efficient railway transport management**
