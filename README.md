# xPi-rience

> A modern full-stack web application built with Nuxt.js and NestJS

## 📋 Description

xPi-rience is a complete web application that combines a modern frontend developed with Nuxt.js 3 and a robust backend using NestJS with TypeScript. The application integrates Google OAuth authentication and uses MySQL as its database.

## 🏗️ Architecture

```
xPi-rience/
├── frontend/          # Nuxt.js 3 Application
│   ├── components/    # Reusable Vue.js components
│   ├── pages/         # Application pages
│   ├── assets/        # Static resources (CSS, images)
│   ├── public/        # Public files
│   └── server/        # Server-side API routes
├── backend/           # NestJS API
│   ├── src/           # TypeScript source code
│   │   ├── auth/      # Authentication module
│   │   ├── users/     # Users module
│   │   └── main.ts    # Application entry point
│   └── test/          # Unit and e2e tests
└── .vscode/           # VS Code configuration
```

## 🚀 Technologies Used

### Frontend
- **Nuxt.js 3** - Full-stack Vue.js framework
- **Vue.js** - Reactive JavaScript framework
- **Vue Router** - Client-side routing
- **TypeScript** - Static typing

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed programming language
- **TypeORM** - ORM for TypeScript and JavaScript
- **MySQL** - Relational database
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Social authentication

### Development Tools
- **ESLint** - JavaScript/TypeScript linter
- **Prettier** - Code formatter
- **Jest** - Testing framework

## 📦 Installation

### Prerequisites
- Node.js (version 18 or higher)
- Yarn or npm
- MySQL (version 8 or higher)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd xPi-rience
```

### 2. Install dependencies

#### Frontend
```bash
cd frontend
yarn install
# or
npm install
```

#### Backend
```bash
cd backend
yarn install
# or
npm install
```

### 3. Environment configuration

#### Frontend (.env)
```env
FRONT_PORT=3001
API_BASE_URL=http://localhost:5001
```

#### Backend (.env)
Copy the `.env.example` file to `.env` and configure your variables:
```env
# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=xpi_rience

# Google OAuth configuration
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Server port
PORT=5001
```

## 🏃‍♂️ Starting

### Development Mode

#### 1. Start the backend
```bash
cd backend
yarn start:dev
# Server starts on http://localhost:5001
```

#### 2. Start the frontend
```bash
cd frontend
yarn dev
# Application starts on http://localhost:3001
```

### Production Mode

#### Backend
```bash
cd backend
yarn build
yarn start:prod
```

#### Frontend
```bash
cd frontend
yarn build
yarn preview
```

## 🧪 Testing

### Backend
```bash
cd backend

# Unit tests
yarn test

# Tests with coverage
yarn test:cov

# E2E tests
yarn test:e2e

# Tests in watch mode
yarn test:watch
```

## 📝 Available Scripts

### Frontend
- `yarn dev` - Start development server
- `yarn build` - Build application for production
- `yarn generate` - Generate static version
- `yarn preview` - Preview production build

### Backend
- `yarn start:dev` - Start in development mode with auto-reload
- `yarn start:debug` - Start in debug mode
- `yarn build` - Compile TypeScript
- `yarn start:prod` - Start in production mode
- `yarn lint` - Check code with ESLint
- `yarn format` - Format code with Prettier

## 🔧 Configuration

### Database
The application uses MySQL with TypeORM. Make sure to:
1. Create a MySQL database
2. Configure environment variables in the `.env` file
3. Migrations run automatically on startup

### Google Authentication
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URLs
5. Add your credentials to the backend `.env` file

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

# This project is under private license - see the `package.json` file for more details.

## 👥 Authors

- **Ludovic Chevroulet** - *Initial development*

## 🆘 Support

If you encounter problems, please:
1. Check that all dependencies are installed
2. Verify environment variable configuration
3. Check frontend and backend server logs
4. Open an issue on the repository

---

*Built with ❤️ using Nuxt.js and NestJS*
