# Local Coffee Shop Super App

A mobile-first multi-tenant platform enabling local coffee shops to have their own branded digital presence within a unified application.

## 📋 Project Overview

This project consists of:
- **Backend API** (NestJS + PostgreSQL + Redis)
- **Mobile App** (React Native - planned)
- **Admin Dashboard** (planned)

## 🏗️ Architecture

- **Backend Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT (access + refresh tokens)
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
ca/
├── backend/                      # NestJS Backend API
│   ├── src/
│   │   ├── modules/              # Feature modules
│   │   │   ├── auth/            # Authentication (login, register, JWT)
│   │   │   ├── users/           # User management
│   │   │   ├── tenants/         # Coffee shop (tenant) management
│   │   │   ├── menus/           # Menu management
│   │   │   ├── orders/          # Order processing
│   │   │   ├── payments/        # Payment integration
│   │   │   ├── loyalty/         # Loyalty & rewards
│   │   │   └── ...              # Other modules
│   │   ├── common/              # Shared utilities
│   │   │   ├── decorators/      # Custom decorators (@CurrentUser, @Tenant)
│   │   │   ├── guards/          # Auth & role guards
│   │   │   ├── interceptors/    # Request/response interceptors
│   │   │   ├── filters/         # Exception filters
│   │   │   └── interfaces/      # TypeScript interfaces
│   │   ├── config/              # Configuration files
│   │   ├── main.ts              # Application entry point
│   │   └── app.module.ts        # Root module
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml            # Docker services configuration
├── docker-compose.dev.yml        # Development overrides
├── TECHNICAL_SPECIFICATION.md    # Detailed technical documentation
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm/npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ca
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start services with Docker Compose**
   ```bash
   # From project root
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL (port 5432)
   - Redis (port 6379)
   - Backend API (port 3000)

5. **Generate Prisma client** (when database is running)
   ```bash
   cd backend
   npm run prisma:generate
   ```

6. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

### Development

**Start backend in development mode:**
```bash
cd backend
npm run start:dev
```

**Access API documentation:**
- Swagger UI: http://localhost:3000/api/docs
- Health check: http://localhost:3000/api/v1/health

**Database management:**
```bash
# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database (⚠️ dangerous)
npx prisma migrate reset
```

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/refresh` | Refresh access token | No |

**Example: Register**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "Ahmet",
    "lastName": "Yılmaz"
  }'
```

**Example: Login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Health Check

```bash
curl http://localhost:3000/api/v1/health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "Coffee Shop API is running",
    "version": "1.0.0",
    "timestamp": "2025-11-15T14:30:00.000Z",
    "environment": "development"
  },
  "meta": {
    "timestamp": "2025-11-15T14:30:00.000Z",
    "version": "1.0"
  }
}
```

### Tenants - Coffee Shops (`/api/v1/tenants`)

**Public Endpoints** (No auth required):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tenants` | Get all coffee shops (with pagination) |
| GET | `/tenants/nearby?latitude=X&longitude=Y&radius=5` | Find nearby coffee shops |
| GET | `/tenants/:slug` | Get coffee shop details by slug |
| GET | `/tenants/:slug/open` | Check if coffee shop is open now |

**Example: Get all coffee shops**
```bash
curl "http://localhost:3000/api/v1/tenants?page=1&limit=10"
```

**Example: Find nearby coffee shops**
```bash
curl "http://localhost:3000/api/v1/tenants/nearby?latitude=40.9923307&longitude=29.0259588&radius=5"
```

**Example: Get coffee shop details**
```bash
curl "http://localhost:3000/api/v1/tenants/nostaljik-kahve"
```

**Admin Endpoints** (`/api/v1/admin/tenants`) - Requires authentication:

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/admin/tenants` | Create new coffee shop | Any |
| GET | `/admin/tenants/:id` | Get coffee shop by ID | Admin, Owner |
| PATCH | `/admin/tenants/:id` | Update coffee shop info | Admin, Owner |
| PATCH | `/admin/tenants/:id/branding` | Update branding | Admin, Owner |
| GET | `/admin/tenants/:id/statistics` | Get statistics | Admin, Owner, Manager |
| DELETE | `/admin/tenants/:id` | Delete coffee shop | Admin, Owner |

**Example: Create coffee shop** (requires auth token)
```bash
curl -X POST http://localhost:3000/api/v1/admin/tenants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Nostaljik Kahve Evi",
    "slug": "nostaljik-kahve",
    "email": "info@nostaljiikkahve.com",
    "phone": "+905551234567",
    "city": "Istanbul",
    "state": "Kadıköy",
    "latitude": 40.9923307,
    "longitude": 29.0259588,
    "description": "Sıcak ve samimi atmosferde özel kahve deneyimi"
  }'
```

**Example: Update branding**
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/tenants/TENANT_ID/branding \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "primaryColor": "#6F4E37",
    "secondaryColor": "#A0826D",
    "accentColor": "#E6BE8A",
    "fontFamily": "Poppins",
    "logoUrl": "https://example.com/logo.png"
  }'
```

## 🗄️ Database Schema

The complete database schema is defined in `backend/prisma/schema.prisma` with 30+ tables including:

### Core Tables
- **tenants** - Coffee shop information
- **tenant_branding** - Custom branding per shop
- **users** - Customer & staff accounts
- **categories** - Menu categories
- **menu_items** - Products/drinks
- **orders** - Order management
- **payments** - Payment processing
- **loyalty_programs** - Loyalty & rewards
- **notifications** - Push/email/SMS notifications
- **reviews** - Ratings & reviews

See `TECHNICAL_SPECIFICATION.md` for the complete schema documentation.

## 🔐 Authentication & Security

### JWT Authentication
- **Access Token**: 15 minutes validity
- **Refresh Token**: 7 days validity
- Tokens stored securely with bcrypt password hashing

### Multi-Tenant Isolation
- Tenant identification via `X-Tenant-Slug` header
- Row-level security in database queries
- Guards ensure proper tenant access

### Security Features
- Password hashing with bcrypt (10 salt rounds)
- Input validation with class-validator
- SQL injection protection via Prisma ORM
- Rate limiting (planned)
- CORS configuration
- Helmet security headers (planned)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Docker Commands

```bash
# Start all services
docker-compose up -d

# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Remove volumes (⚠️ deletes data)
docker-compose down -v
```

## 🛠️ Development Scripts

```bash
# Backend
npm run start         # Start production
npm run start:dev     # Start with watch mode
npm run start:debug   # Start with debug mode
npm run build         # Build for production
npm run lint          # Run ESLint
npm run format        # Format code with Prettier

# Prisma
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
```

## 📖 Documentation

- **[Technical Specification](./TECHNICAL_SPECIFICATION.md)** - Comprehensive technical documentation
- **API Docs** - http://localhost:3000/api/docs (Swagger UI)
- **Prisma Schema** - `backend/prisma/schema.prisma`

## 🗺️ Roadmap

### Phase 1 - MVP (Current)
- [x] Project setup & infrastructure
- [x] NestJS backend with modular architecture
- [x] Docker Compose configuration
- [x] Prisma ORM with complete schema
- [x] Authentication module (JWT)
- [x] Common utilities (guards, decorators, interceptors)
- [ ] Database migrations
- [ ] Tenant management module
- [ ] Menu management module
- [ ] Order processing module
- [ ] Payment integration (Iyzico)
- [ ] Basic loyalty system

### Phase 2 - Mobile App
- [ ] React Native app setup
- [ ] Authentication screens
- [ ] Coffee shop discovery
- [ ] Menu browsing & ordering
- [ ] Order tracking
- [ ] Loyalty card

### Phase 3 - Advanced Features
- [ ] Real-time order tracking (WebSocket)
- [ ] Push notifications
- [ ] QR code ordering
- [ ] Reviews & ratings
- [ ] Analytics dashboard
- [ ] Admin panel

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 Environment Variables

Key environment variables (see `.env.example` for full list):

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coffeeapp

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🐛 Troubleshooting

### Prisma Client Generation Issues
If you encounter Prisma binary download errors:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Issues
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Verify DATABASE_URL in `.env`

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ for local coffee shops**
