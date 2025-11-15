# Coffee Shop Admin Panel

Web-based admin dashboard for managing coffee shop operations.

## Features

### ✅ Implemented
- **Authentication**: Admin login with JWT tokens
- **Dashboard**: Real-time statistics and metrics
  - Today's revenue and orders
  - Active orders count
  - Completed orders tracking
- **Orders Management**:
  - View all orders with status filtering
  - Update order status (Pending → Confirmed → Preparing → Ready → Completed)
  - View order details and customer information
  - Real-time order tracking

### 🚧 Planned
- **Menu Management**: Add, edit, and delete menu items and categories
- **Tenant Settings**: Update shop info, hours, and branding
- **Reports & Analytics**: Sales reports, popular items, customer insights
- **Push Notifications**: Real-time order notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Update .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Development

```bash
# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3001
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── orders/        # Orders management
│   │   │   └── page.tsx       # Main dashboard
│   │   ├── login/             # Login page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # React Query provider
│   ├── components/            # Reusable components
│   │   └── DashboardLayout.tsx
│   └── lib/                   # Utilities and services
│       └── api/               # API client and services
│           ├── client.ts      # Axios client with interceptors
│           └── services/      # API service modules
│               ├── auth.ts
│               ├── orders.ts
│               └── menu.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API Integration

The admin panel connects to the NestJS backend API. Make sure the backend is running before starting the admin panel.

### Authentication
- Login endpoint: `POST /api/v1/auth/login`
- Token stored in localStorage
- Automatic token refresh on 401 responses

### Orders API
- Get all orders: `GET /api/v1/admin/tenants/:tenantId/orders`
- Update order status: `PATCH /api/v1/admin/tenants/:tenantId/orders/:orderId/status`
- Get statistics: `GET /api/v1/admin/tenants/:tenantId/orders/stats`

## Default Credentials

For testing purposes (update with real credentials):
```
Email: admin@coffeeshop.com
Password: your-password
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t coffee-admin .

# Run container
docker run -p 3001:3001 coffee-admin
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

Private - All Rights Reserved
