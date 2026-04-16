# Urban Farming Platform API

An Interactive Urban Farming Platform Backend built with Express.js, Prisma, and PostgreSQL.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL or Docker

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (a `.env` file has been created for you):
   ```bash
   # Make sure DATABASE_URL is correct
   ```

### Running the Database

#### Option 1: Using Docker (Recommended)
If you have Docker installed, simply run:
```bash
docker-compose up -d
```

#### Option 2: Local PostgreSQL
Ensure PostgreSQL is running and create a database named `farming_db`. Update the `DATABASE_URL` in your `.env` file if necessary.

### Database Setup
Run migrations and generate Prisma client:
```bash
npx prisma migrate dev --name init
```

(Optional) Seed the database with initial data:
```bash
npm run seed
```

### Running the Application
Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Documentation
Once the server is running, you can access the Swagger documentation at:
`http://localhost:3000/api-docs`
