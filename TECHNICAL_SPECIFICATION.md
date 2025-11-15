# Local Coffee Shop Super App - Technical Specification

**Version:** 1.0
**Date:** November 2025
**Project Type:** Mobile-First Multi-Tenant Coffee Shop Platform

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Mobile Application](#mobile-application)
4. [Backend Services](#backend-services)
5. [Database Design](#database-design)
6. [API Specifications](#api-specifications)
7. [Multi-Tenant Strategy](#multi-tenant-strategy)
8. [Security & Authentication](#security--authentication)
9. [Payment Integration](#payment-integration)
10. [Real-time Features](#real-time-features)
11. [Notification System](#notification-system)
12. [Analytics & Reporting](#analytics--reporting)
13. [Deployment & Infrastructure](#deployment--infrastructure)
14. [Development Phases](#development-phases)
15. [Performance Requirements](#performance-requirements)

---

## Executive Summary

### Vision
A mobile super-app that enables local coffee shops to have their own branded digital presence within a unified platform. Each coffee shop gets a personalized interface with their own branding, menu, and loyalty program, while customers enjoy a seamless experience across all participating venues.

### Key Differentiators
- **Multi-tenant architecture** - One app, multiple coffee shops
- **Brand personalization** - Each shop maintains its unique identity
- **Unified loyalty** - Customers can earn and track points across all shops
- **Mobile-first** - Native iOS and Android applications
- **Local focus** - Supporting independent coffee shops, not chains

### Target Users
- **Customers (B2C)**: Coffee lovers who frequent local shops
- **Coffee Shop Owners (B2B)**: Small to medium-sized independent coffee shops
- **Coffee Shop Staff**: Baristas and managers who fulfill orders

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Apps Layer                     │
│  ┌──────────────┐              ┌──────────────┐         │
│  │   iOS App    │              │ Android App  │         │
│  │  (React      │              │ (React       │         │
│  │   Native)    │              │  Native)     │         │
│  └──────────────┘              └──────────────┘         │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ REST API / GraphQL / WebSocket
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    API Gateway Layer                     │
│  ┌────────────────────────────────────────────────┐     │
│  │   Nginx / Kong / AWS API Gateway               │     │
│  │   - Rate Limiting                              │     │
│  │   - Authentication                             │     │
│  │   - Request Routing                            │     │
│  └────────────────────────────────────────────────┘     │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│               Backend Services Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │ Tenants  │  │   Menu   │              │
│  │ Service  │  │ Service  │  │ Service  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Orders  │  │ Payments │  │  Loyalty │              │
│  │ Service  │  │ Service  │  │ Service  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Notif.  │  │Analytics │  │  Media   │              │
│  │ Service  │  │ Service  │  │ Service  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
│         NestJS Framework (TypeScript)                    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐          │
│  │  PostgreSQL  │  │  Redis   │  │    S3    │          │
│  │   (Primary)  │  │  (Cache) │  │ (Storage)│          │
│  └──────────────┘  └──────────┘  └──────────┘          │
│  ┌──────────────┐  ┌──────────┐                        │
│  │ Elasticsearch│  │  RabbitMQ│                        │
│  │   (Search)   │  │  (Queue) │                        │
│  └──────────────┘  └──────────┘                        │
└─────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│              External Services                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Iyzico  │  │ Firebase │  │  Twilio  │              │
│  │ (Payment)│  │   (FCM)  │  │  (SMS)   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐                            │
│  │ SendGrid │  │  Google  │                            │
│  │  (Email) │  │   Maps   │                            │
│  └──────────┘  └──────────┘                            │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Mobile Application
- **Framework**: React Native (cross-platform)
- **State Management**: Redux Toolkit / Zustand
- **Navigation**: React Navigation
- **UI Library**: React Native Paper / NativeBase
- **Maps**: React Native Maps (Google Maps integration)
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Payment**: Native modules for Apple Pay / Google Pay
- **Local Storage**: AsyncStorage / MMKV
- **Real-time**: Socket.io-client
- **API Client**: Axios / React Query
- **Deep Linking**: React Navigation Deep Linking
- **QR Code**: react-native-qrcode-scanner

#### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **API Style**: RESTful + GraphQL (for complex queries) + WebSocket
- **ORM**: Prisma / TypeORM
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger / OpenAPI
- **Testing**: Jest, Supertest

#### Database & Storage
- **Primary DB**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search Engine**: Elasticsearch 8+
- **Object Storage**: AWS S3 / MinIO
- **Message Queue**: RabbitMQ / Bull (Redis-based)

#### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes / Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking**: Sentry
- **APM**: New Relic / DataDog
- **Cloud Provider**: AWS / DigitalOcean / Hetzner

---

## Mobile Application

### Platform Support
- **iOS**: 14.0+
- **Android**: API Level 23+ (Android 6.0 Marshmallow)

### App Architecture (Clean Architecture)

```
src/
├── app/
│   ├── navigation/          # Navigation configuration
│   ├── store/              # Redux store setup
│   └── App.tsx
├── features/
│   ├── auth/
│   │   ├── screens/        # Login, Register, ForgotPassword
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/          # Auth slice
│   ├── coffee-shops/
│   │   ├── screens/        # ShopList, ShopDetail
│   │   ├── components/
│   │   └── store/
│   ├── menu/
│   │   ├── screens/        # Menu, ItemDetail
│   │   ├── components/
│   │   └── store/
│   ├── cart/
│   │   ├── screens/        # Cart, Checkout
│   │   ├── components/
│   │   └── store/
│   ├── orders/
│   │   ├── screens/        # OrderHistory, OrderTracking
│   │   ├── components/
│   │   └── store/
│   ├── loyalty/
│   │   ├── screens/        # LoyaltyCard, Rewards
│   │   ├── components/
│   │   └── store/
│   └── profile/
│       ├── screens/        # Profile, Settings
│       └── components/
├── shared/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   ├── constants/
│   ├── types/
│   └── services/
│       ├── api/            # API client
│       ├── socket/         # WebSocket client
│       ├── storage/        # AsyncStorage wrapper
│       ├── notifications/  # FCM setup
│       └── location/       # Geolocation
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── assets/
    ├── images/
    ├── fonts/
    └── animations/
```

### Key Mobile Features

#### 1. Dynamic Branding (Per Coffee Shop)
- **Theme switching**: Each coffee shop has custom colors, fonts, logo
- **Cached branding**: Store branding data locally for offline access
- **Smooth transitions**: Animated theme changes when switching shops

```typescript
interface TenantBranding {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  fontFamily: string;
  customCSS?: string;
}
```

#### 2. Location-Based Discovery
- **Map view**: Show nearby coffee shops on map
- **List view**: Sorted by distance
- **Geofencing**: Push notification when near a favorite shop
- **Working hours**: Show open/closed status
- **Filter**: By distance, rating, specialty

#### 3. Menu & Ordering
- **Visual menu**: High-quality images, descriptions
- **Customizations**: Size, milk type, sugar, extra shots, dietary tags
- **Cart management**: Multi-item cart with modifications
- **Saved favorites**: Quick reorder
- **Scheduled orders**: Pre-order for specific time
- **Dietary filters**: Vegan, gluten-free, etc.

#### 4. Real-time Order Tracking
- **Order status**: Pending → Preparing → Ready → Completed
- **Push notifications**: Status change alerts
- **ETA display**: Estimated ready time
- **Live updates**: WebSocket connection for real-time updates
- **Cancel option**: Cancel before preparation starts

#### 5. Payment Methods
- **Credit/Debit card**: Saved cards
- **Apple Pay / Google Pay**: Native integration
- **Wallet**: In-app balance
- **Cash**: Pay at pickup
- **Gift cards**: Redeem codes

#### 6. Loyalty & Rewards
- **Points system**: Earn points per purchase
- **Tier system**: Bronze/Silver/Gold based on spending
- **Rewards catalog**: Redeem points for free items
- **Special offers**: Push notifications for promotions
- **Referral program**: Invite friends, earn points
- **Per-shop loyalty**: Each shop has its own loyalty program

#### 7. QR Code Features
- **Scan to order**: Scan QR at table to open shop menu
- **Payment QR**: Generate QR for payment at counter
- **Loyalty QR**: Scan at POS to earn points

#### 8. Social Features
- **Reviews & Ratings**: Rate shops and items
- **Photo uploads**: Share drink photos
- **Friend system**: See what friends ordered
- **Gift coffee**: Send a coffee to a friend

#### 9. Offline Support
- **Cached menu**: View menus offline
- **Saved orders**: Access order history
- **Queue orders**: Submit when connection returns

### Mobile App User Flows

#### First-time User Flow
```
1. Splash Screen → 2. Onboarding (3 slides) → 3. Location Permission
→ 4. Sign Up/Login → 5. Discover Nearby Shops → 6. Tutorial Overlay
```

#### Ordering Flow
```
1. Browse Shops (Map/List) → 2. Select Shop → 3. View Menu
→ 4. Select Item → 5. Customize → 6. Add to Cart
→ 7. Review Cart → 8. Choose Payment → 9. Place Order
→ 10. Real-time Tracking → 11. Order Ready Notification → 12. Pickup
→ 13. Rate & Review
```

#### Loyalty Flow
```
1. Complete Order → 2. Earn Points (Auto) → 3. View Balance
→ 4. Browse Rewards → 5. Redeem Reward → 6. Apply to Next Order
```

### Mobile Performance Targets
- **App launch**: < 2 seconds
- **Screen transitions**: 60 FPS
- **API response handling**: Optimistic updates
- **Image loading**: Progressive loading with placeholders
- **Bundle size**: < 50MB (iOS), < 30MB (Android)
- **Memory usage**: < 200MB on average device
- **Offline capability**: Core features available offline

---

## Backend Services

### Service Architecture (Modular Monolith → Microservices Ready)

```
src/
├── main.ts                    # Application bootstrap
├── app.module.ts              # Root module
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   └── aws.config.ts
├── common/
│   ├── decorators/
│   │   ├── tenant.decorator.ts        # @Tenant() decorator
│   │   ├── user.decorator.ts          # @CurrentUser() decorator
│   │   └── public.decorator.ts        # @Public() API decorator
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── tenant.guard.ts            # Multi-tenant isolation
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   ├── transform.interceptor.ts
│   │   └── timeout.interceptor.ts
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   ├── middleware/
│   │   └── tenant-resolver.middleware.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── interfaces/
│       └── tenant-request.interface.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local.strategy.ts
│   │   │   └── refresh-token.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   ├── tenants/
│   │   ├── tenants.module.ts
│   │   ├── tenants.controller.ts
│   │   ├── tenants.service.ts
│   │   ├── entities/
│   │   │   ├── tenant.entity.ts
│   │   │   └── tenant-branding.entity.ts
│   │   └── dto/
│   │       ├── create-tenant.dto.ts
│   │       └── update-branding.dto.ts
│   ├── menus/
│   │   ├── menus.module.ts
│   │   ├── menus.controller.ts
│   │   ├── menus.service.ts
│   │   ├── entities/
│   │   │   ├── category.entity.ts
│   │   │   ├── menu-item.entity.ts
│   │   │   ├── customization.entity.ts
│   │   │   └── customization-option.entity.ts
│   │   └── dto/
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.gateway.ts          # WebSocket gateway
│   │   ├── entities/
│   │   │   ├── order.entity.ts
│   │   │   └── order-item.entity.ts
│   │   ├── dto/
│   │   └── enums/
│   │       └── order-status.enum.ts
│   ├── payments/
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── providers/
│   │   │   ├── iyzico.provider.ts
│   │   │   ├── stripe.provider.ts
│   │   │   └── wallet.provider.ts
│   │   └── entities/
│   │       ├── payment.entity.ts
│   │       └── payment-method.entity.ts
│   ├── loyalty/
│   │   ├── loyalty.module.ts
│   │   ├── loyalty.controller.ts
│   │   ├── loyalty.service.ts
│   │   ├── entities/
│   │   │   ├── loyalty-program.entity.ts
│   │   │   ├── user-loyalty.entity.ts
│   │   │   ├── reward.entity.ts
│   │   │   └── reward-redemption.entity.ts
│   │   └── dto/
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts
│   │   ├── providers/
│   │   │   ├── fcm.provider.ts        # Firebase Cloud Messaging
│   │   │   ├── sms.provider.ts        # Twilio/Netgsm
│   │   │   └── email.provider.ts      # SendGrid
│   │   └── entities/
│   │       └── notification.entity.ts
│   ├── analytics/
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── dto/
│   ├── media/
│   │   ├── media.module.ts
│   │   ├── media.controller.ts
│   │   ├── media.service.ts
│   │   └── providers/
│   │       └── s3.provider.ts
│   ├── search/
│   │   ├── search.module.ts
│   │   ├── search.service.ts
│   │   └── providers/
│   │       └── elasticsearch.provider.ts
│   └── reviews/
│       ├── reviews.module.ts
│       ├── reviews.controller.ts
│       ├── reviews.service.ts
│       └── entities/
│           └── review.entity.ts
└── database/
    ├── migrations/
    ├── seeds/
    └── factories/
```

### Core Services Description

#### Auth Service
- User registration (email/phone)
- Login (email/phone + password)
- JWT token generation (access + refresh)
- Password reset flow
- Email/Phone verification
- OAuth2 integration (Google, Apple)
- Session management
- Device tracking

#### Tenant Service
- Coffee shop onboarding
- Branding management (logo, colors, fonts)
- Business information (name, address, hours)
- Settings management
- Staff management
- Subscription/plan management
- Multi-location support (chains)

#### Menu Service
- Category CRUD
- Menu item CRUD
- Item variations (sizes, temperatures)
- Customization options (milk, sugar, extras)
- Pricing rules
- Availability management (in-stock/out-of-stock)
- Dietary tags (vegan, gluten-free)
- Image management

#### Order Service
- Cart management (ephemeral/session-based)
- Order creation
- Order status management
- Order history
- Scheduled orders
- Order cancellation
- Order modification (before preparation)
- Kitchen display integration

#### Payment Service
- Payment processing
- Payment method management (save/delete cards)
- Refund handling
- Transaction history
- Wallet/balance management
- Invoice generation
- Split payment support

#### Loyalty Service
- Points calculation and accrual
- Tier management (bronze/silver/gold)
- Reward catalog
- Reward redemption
- Expiration handling
- Special promotions/campaigns
- Referral program

#### Notification Service
- Push notification sending (FCM)
- SMS sending (Twilio)
- Email sending (SendGrid)
- Notification preferences
- Template management
- Scheduled notifications
- Notification history

#### Analytics Service
- Order analytics (per tenant)
- Revenue reports
- Popular items
- Customer analytics (retention, LTV)
- Real-time dashboards
- Export capabilities (CSV, PDF)

#### Media Service
- Image upload (S3)
- Image optimization
- CDN integration
- File validation
- Thumbnail generation

#### Search Service
- Coffee shop search (name, location, specialties)
- Menu item search
- Autocomplete
- Filters and facets
- Elasticsearch indexing

#### Review Service
- Rate coffee shops (1-5 stars)
- Rate menu items
- Text reviews
- Photo reviews
- Moderation
- Reply to reviews (shop owners)

---

## Database Design

### Database Schema (PostgreSQL)

#### Core Tables

```sql
-- ============================================
-- TENANTS & BRANDING
-- ============================================

CREATE TYPE subscription_plan AS ENUM ('trial', 'basic', 'pro', 'enterprise');
CREATE TYPE tenant_status AS ENUM ('pending', 'active', 'suspended', 'cancelled');

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'TR',

    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Business info
    description TEXT,
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),

    -- Hours of operation (JSONB)
    business_hours JSONB DEFAULT '{
        "monday": {"open": "08:00", "close": "20:00", "closed": false},
        "tuesday": {"open": "08:00", "close": "20:00", "closed": false},
        "wednesday": {"open": "08:00", "close": "20:00", "closed": false},
        "thursday": {"open": "08:00", "close": "20:00", "closed": false},
        "friday": {"open": "08:00", "close": "20:00", "closed": false},
        "saturday": {"open": "09:00", "close": "21:00", "closed": false},
        "sunday": {"open": "09:00", "close": "18:00", "closed": false}
    }'::JSONB,

    -- Subscription
    subscription_plan subscription_plan DEFAULT 'trial',
    subscription_started_at TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    trial_ends_at TIMESTAMP,

    -- Settings
    commission_rate DECIMAL(5, 2) DEFAULT 10.00,
    currency VARCHAR(3) DEFAULT 'TRY',
    timezone VARCHAR(50) DEFAULT 'Europe/Istanbul',

    -- Status
    status tenant_status DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE tenant_branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    -- Colors (hex codes)
    primary_color VARCHAR(7) DEFAULT '#6F4E37',
    secondary_color VARCHAR(7) DEFAULT '#A0826D',
    accent_color VARCHAR(7) DEFAULT '#E6BE8A',
    background_color VARCHAR(7) DEFAULT '#FFFFFF',
    text_color VARCHAR(7) DEFAULT '#333333',

    -- Typography
    font_family VARCHAR(100) DEFAULT 'Roboto',
    heading_font VARCHAR(100),

    -- Custom CSS (advanced users)
    custom_css TEXT,

    -- Images
    logo_url VARCHAR(500),
    icon_url VARCHAR(500),
    splash_screen_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(tenant_id)
);

CREATE TABLE tenant_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'owner', 'manager', 'barista'
    permissions JSONB DEFAULT '[]'::JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    terminated_at TIMESTAMP,

    UNIQUE(tenant_id, user_id)
);

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),

    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    date_of_birth DATE,

    -- Preferences
    preferred_language VARCHAR(5) DEFAULT 'tr',
    notification_preferences JSONB DEFAULT '{
        "push": true,
        "email": true,
        "sms": false,
        "marketing": true
    }'::JSONB,

    -- Auth
    role user_role DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    phone_verification_code VARCHAR(6),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,

    -- OAuth
    google_id VARCHAR(255),
    apple_id VARCHAR(255),
    facebook_id VARCHAR(255),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token VARCHAR(500) NOT NULL, -- FCM token
    device_type VARCHAR(20) NOT NULL, -- 'ios', 'android'
    device_name VARCHAR(255),
    app_version VARCHAR(20),
    os_version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    device_id UUID REFERENCES user_devices(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP
);

-- ============================================
-- MENU MANAGEMENT
-- ============================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(tenant_id, slug)
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),

    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',

    -- Nutritional info (optional)
    calories INTEGER,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    caffeine INTEGER, -- mg

    -- Tags
    tags JSONB DEFAULT '[]'::JSONB, -- ['vegan', 'gluten-free', 'sugar-free']
    allergens JSONB DEFAULT '[]'::JSONB, -- ['milk', 'nuts']

    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_quantity INTEGER,

    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    UNIQUE(tenant_id, slug)
);

CREATE TABLE customization_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Size', 'Milk Type', 'Extras'
    type VARCHAR(50) NOT NULL, -- 'single_select', 'multi_select'
    is_required BOOLEAN DEFAULT FALSE,
    min_selections INTEGER DEFAULT 0,
    max_selections INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customization_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Large', 'Oat Milk', 'Extra Shot'
    price_modifier DECIMAL(10, 2) DEFAULT 0.00, -- Additional cost
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_item_customizations (
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    customization_group_id UUID NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_item_id, customization_group_id)
);

-- ============================================
-- ORDERS
-- ============================================

CREATE TYPE order_status AS ENUM (
    'pending',      -- Order created, awaiting payment
    'paid',         -- Payment confirmed
    'confirmed',    -- Shop confirmed order
    'preparing',    -- Being prepared
    'ready',        -- Ready for pickup
    'completed',    -- Order completed
    'cancelled'     -- Order cancelled
);

CREATE TYPE order_type AS ENUM ('pickup', 'dine_in', 'delivery');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable: 'ORD-20250115-0001'

    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Order details
    order_type order_type DEFAULT 'pickup',
    status order_status DEFAULT 'pending',

    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    loyalty_points_used INTEGER DEFAULT 0,
    loyalty_discount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',

    -- Timing
    scheduled_for TIMESTAMP, -- For pre-orders
    estimated_ready_time TIMESTAMP,
    ready_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,

    -- Special instructions
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,

    -- Snapshot of item at order time (in case menu changes)
    item_name VARCHAR(255) NOT NULL,
    item_image_url VARCHAR(500),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,

    -- Selected customizations
    customizations JSONB DEFAULT '[]'::JSONB,
    -- Example: [
    --   {"group": "Size", "option": "Large", "price": 5.00},
    --   {"group": "Milk", "option": "Oat Milk", "price": 2.00}
    -- ]

    subtotal DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method_type AS ENUM ('card', 'apple_pay', 'google_pay', 'wallet', 'cash');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),

    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',

    payment_method payment_method_type NOT NULL,
    payment_provider VARCHAR(50), -- 'iyzico', 'stripe'
    provider_transaction_id VARCHAR(255),

    status payment_status DEFAULT 'pending',

    -- Card details (last 4 digits only)
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),

    -- Metadata
    metadata JSONB,

    -- Refund
    refunded_amount DECIMAL(10, 2) DEFAULT 0.00,
    refunded_at TIMESTAMP,
    refund_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type payment_method_type NOT NULL,
    provider VARCHAR(50),
    provider_payment_method_id VARCHAR(255), -- Stripe payment method ID

    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    card_exp_month INTEGER,
    card_exp_year INTEGER,

    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'TRY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id)
);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES user_wallets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'credit', 'debit', 'refund'
    amount DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    description TEXT,
    reference_type VARCHAR(50), -- 'order', 'topup', 'refund'
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LOYALTY & REWARDS
-- ============================================

CREATE TYPE tier_level AS ENUM ('bronze', 'silver', 'gold', 'platinum');

CREATE TABLE loyalty_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Points rules
    points_per_currency_unit DECIMAL(5, 2) DEFAULT 1.00, -- 1 TRY = 1 point
    points_expiry_days INTEGER DEFAULT 365,

    -- Tier thresholds (annual spending)
    bronze_threshold DECIMAL(10, 2) DEFAULT 0.00,
    silver_threshold DECIMAL(10, 2) DEFAULT 500.00,
    gold_threshold DECIMAL(10, 2) DEFAULT 1500.00,
    platinum_threshold DECIMAL(10, 2) DEFAULT 5000.00,

    -- Tier benefits (point multipliers)
    bronze_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    silver_multiplier DECIMAL(3, 2) DEFAULT 1.25,
    gold_multiplier DECIMAL(3, 2) DEFAULT 1.50,
    platinum_multiplier DECIMAL(3, 2) DEFAULT 2.00,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(tenant_id)
);

CREATE TABLE user_loyalty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    points_balance INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,

    current_tier tier_level DEFAULT 'bronze',
    annual_spending DECIMAL(10, 2) DEFAULT 0.00,

    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,

    tier_updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, tenant_id)
);

CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_loyalty_id UUID NOT NULL REFERENCES user_loyalty(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),

    type VARCHAR(20) NOT NULL, -- 'earn', 'redeem', 'expire', 'adjust'
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,

    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),

    points_cost INTEGER NOT NULL,

    -- Reward type
    reward_type VARCHAR(50) NOT NULL, -- 'free_item', 'discount_percentage', 'discount_fixed'

    -- For free_item type
    free_menu_item_id UUID REFERENCES menu_items(id),

    -- For discount types
    discount_percentage DECIMAL(5, 2),
    discount_fixed_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),

    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    available_from TIMESTAMP,
    available_until TIMESTAMP,

    -- Usage limits
    max_redemptions_per_user INTEGER,
    total_redemptions_limit INTEGER,
    current_redemptions INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_id UUID NOT NULL REFERENCES rewards(id),
    user_id UUID NOT NULL REFERENCES users(id),
    order_id UUID REFERENCES orders(id),

    points_spent INTEGER NOT NULL,

    -- Generated code (for scanning at POS)
    redemption_code VARCHAR(20) UNIQUE,

    redeemed_at TIMESTAMP,
    expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TYPE notification_type AS ENUM (
    'order_confirmed',
    'order_preparing',
    'order_ready',
    'order_completed',
    'order_cancelled',
    'loyalty_points_earned',
    'reward_available',
    'promotion',
    'system'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,

    -- Related entities
    order_id UUID REFERENCES orders(id),
    tenant_id UUID REFERENCES tenants(id),

    -- Delivery
    sent_via JSONB DEFAULT '[]'::JSONB, -- ['push', 'email', 'sms']
    push_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,

    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Additional data
    data JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,

    -- Photo uploads
    photos JSONB DEFAULT '[]'::JSONB,

    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    moderation_notes TEXT,

    -- Response from shop
    response_text TEXT,
    response_at TIMESTAMP,

    helpful_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, order_id)
);

CREATE TABLE menu_item_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    photos JSONB DEFAULT '[]'::JSONB,

    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ANALYTICS & EVENTS
-- ============================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),

    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'item_view', 'add_to_cart', 'purchase'
    event_data JSONB,

    -- Session tracking
    session_id VARCHAR(255),
    device_type VARCHAR(20),

    -- Location
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROMOTIONS & CAMPAIGNS
-- ============================================

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_item');

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2),
    min_order_amount DECIMAL(10, 2),

    -- Free item promotion
    free_menu_item_id UUID REFERENCES menu_items(id),

    -- Validity
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,

    -- Usage limits
    max_uses INTEGER,
    max_uses_per_user INTEGER,
    current_uses INTEGER DEFAULT 0,

    -- Targeting
    applicable_to JSONB, -- Category IDs, menu item IDs
    first_order_only BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promotion_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance

```sql
-- Tenants
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status) WHERE is_active = TRUE;
CREATE INDEX idx_tenants_location ON tenants USING GIST(ll_to_earth(latitude, longitude));

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Orders
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_tenant_created ON orders(tenant_id, created_at DESC);

-- Menu Items
CREATE INDEX idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_slug ON menu_items(tenant_id, slug);

-- Loyalty
CREATE INDEX idx_user_loyalty_user_tenant ON user_loyalty(user_id, tenant_id);
CREATE INDEX idx_loyalty_transactions_user ON loyalty_transactions(user_loyalty_id, created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_tenant_id ON reviews(tenant_id) WHERE is_approved = TRUE;
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- Full-text search
CREATE INDEX idx_tenants_name_fts ON tenants USING GIN(to_tsvector('turkish', business_name));
CREATE INDEX idx_menu_items_name_fts ON menu_items USING GIN(to_tsvector('turkish', name || ' ' || COALESCE(description, '')));
```

---

## API Specifications

### API Design Principles
- **RESTful**: Resource-oriented URLs
- **Versioning**: `/api/v1/...`
- **Consistent responses**: Standard envelope format
- **Pagination**: Cursor-based or offset-based
- **Filtering & Sorting**: Query parameters
- **Error handling**: Consistent error format
- **Rate limiting**: Per user/IP
- **CORS**: Enabled for mobile apps

### Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-15T10:30:00Z",
    "version": "1.0"
  }
}
```

Error response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-11-15T10:30:00Z"
  }
}
```

### Key API Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/verify-phone
POST   /api/v1/auth/oauth/google
POST   /api/v1/auth/oauth/apple
```

#### Users
```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
DELETE /api/v1/users/me
PATCH  /api/v1/users/me/password
POST   /api/v1/users/me/avatar
GET    /api/v1/users/me/devices
POST   /api/v1/users/me/devices
DELETE /api/v1/users/me/devices/:id
```

#### Tenants (Coffee Shops)
```
GET    /api/v1/tenants                    # List all shops (with filters)
GET    /api/v1/tenants/nearby             # Get nearby shops (lat/lng required)
GET    /api/v1/tenants/:slug              # Get shop details
GET    /api/v1/tenants/:slug/menu         # Get shop menu
GET    /api/v1/tenants/:slug/reviews      # Get shop reviews
GET    /api/v1/tenants/:slug/hours        # Get business hours

# Admin endpoints (for shop owners/staff)
POST   /api/v1/admin/tenants              # Create new shop (onboarding)
PATCH  /api/v1/admin/tenants/:id
GET    /api/v1/admin/tenants/:id/analytics
PATCH  /api/v1/admin/tenants/:id/branding
PATCH  /api/v1/admin/tenants/:id/hours
```

#### Menu
```
GET    /api/v1/tenants/:slug/categories
GET    /api/v1/tenants/:slug/menu-items
GET    /api/v1/tenants/:slug/menu-items/:id

# Admin endpoints
POST   /api/v1/admin/menu-items
PATCH  /api/v1/admin/menu-items/:id
DELETE /api/v1/admin/menu-items/:id
PATCH  /api/v1/admin/menu-items/:id/availability
POST   /api/v1/admin/customization-groups
POST   /api/v1/admin/customization-options
```

#### Orders
```
POST   /api/v1/orders                     # Create order
GET    /api/v1/orders                     # List user's orders
GET    /api/v1/orders/:id                 # Get order details
PATCH  /api/v1/orders/:id/cancel          # Cancel order
GET    /api/v1/orders/:id/track           # Real-time tracking

# Admin endpoints
GET    /api/v1/admin/orders               # List shop's orders
PATCH  /api/v1/admin/orders/:id/status    # Update order status
GET    /api/v1/admin/orders/:id/receipt   # Generate receipt
```

#### Payments
```
POST   /api/v1/payments/create-intent     # Create payment intent
POST   /api/v1/payments/confirm           # Confirm payment
POST   /api/v1/payments/methods           # Save payment method
GET    /api/v1/payments/methods
DELETE /api/v1/payments/methods/:id
GET    /api/v1/payments/history

# Wallet
GET    /api/v1/wallet/balance
POST   /api/v1/wallet/topup
GET    /api/v1/wallet/transactions
```

#### Loyalty
```
GET    /api/v1/loyalty/:tenantSlug        # Get loyalty status for a shop
GET    /api/v1/loyalty/:tenantSlug/transactions
GET    /api/v1/loyalty/:tenantSlug/rewards
POST   /api/v1/loyalty/:tenantSlug/redeem # Redeem reward

# Admin endpoints
POST   /api/v1/admin/rewards              # Create reward
PATCH  /api/v1/admin/rewards/:id
GET    /api/v1/admin/loyalty/analytics
```

#### Reviews
```
POST   /api/v1/reviews                    # Create review
GET    /api/v1/reviews/:id
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
POST   /api/v1/reviews/:id/helpful        # Mark as helpful

# Admin endpoints
POST   /api/v1/admin/reviews/:id/respond
PATCH  /api/v1/admin/reviews/:id/moderate
```

#### Notifications
```
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
PATCH  /api/v1/notifications/preferences
```

#### Search
```
GET    /api/v1/search/shops?q=espresso
GET    /api/v1/search/menu-items?q=latte
GET    /api/v1/search/autocomplete?q=cof
```

### WebSocket Events (Real-time)

**Connection:**
```javascript
const socket = io('wss://api.coffeapp.com', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

**Events:**
```javascript
// Client subscribes to order updates
socket.emit('subscribe:order', { orderId: 'uuid' });

// Server sends order status updates
socket.on('order:status_changed', (data) => {
  // { orderId, status, estimatedReadyTime, message }
});

// Client subscribes to shop updates (for staff)
socket.emit('subscribe:shop', { tenantId: 'uuid' });

// Server sends new order notifications
socket.on('shop:new_order', (data) => {
  // { order: {...} }
});
```

### GraphQL API (Optional for Complex Queries)

```graphql
type Query {
  tenant(slug: String!): Tenant
  nearbyTenants(latitude: Float!, longitude: Float!, radius: Int): [Tenant!]!
  menuItem(id: ID!): MenuItem
  order(id: ID!): Order
  myOrders(limit: Int, offset: Int): OrderConnection!
  myLoyalty(tenantId: ID!): UserLoyalty
}

type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!
  redeemReward(rewardId: ID!): RewardRedemption!
  submitReview(input: ReviewInput!): Review!
}

type Subscription {
  orderStatusChanged(orderId: ID!): OrderStatusUpdate!
}
```

---

## Multi-Tenant Strategy

### Tenant Isolation Approaches

#### 1. Row-Level Security (Chosen Approach)
- All data in shared tables
- `tenant_id` column in every tenant-specific table
- Enforced via middleware/guards
- PostgreSQL Row Level Security policies

**Pros:**
- Cost-effective
- Easy to manage
- Good for B2B SaaS
- Efficient queries

**Cons:**
- Must ensure perfect isolation in code
- One bug could leak data

**Implementation:**
```typescript
// Middleware to extract tenant
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract from subdomain, header, or JWT
    const tenantSlug = req.headers['x-tenant-slug'] as string;
    req['tenantSlug'] = tenantSlug;
    next();
  }
}

// Guard to enforce tenant access
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantSlug = request.tenantSlug;

    if (!tenantSlug) {
      throw new UnauthorizedException('Tenant not specified');
    }

    return true;
  }
}

// Global query filter
@Injectable()
export class TenantService {
  async findAllMenuItems(tenantId: string) {
    return this.menuItemRepository.find({
      where: { tenantId },
    });
  }
}
```

### Tenant Identification Methods

1. **Subdomain**: `coffeeshop1.coffeapp.com`
2. **Path**: `coffeapp.com/coffeeshop1/menu`
3. **Header**: `X-Tenant-Slug: coffeeshop1`
4. **Mobile app**: Stored in app state after shop selection

**Chosen for mobile app:** Header-based (`X-Tenant-Slug`)

---

## Security & Authentication

### Authentication Flow

#### JWT-Based Authentication
- **Access Token**: Short-lived (15 minutes), contains user ID, role
- **Refresh Token**: Long-lived (7 days), stored in database
- **Token rotation**: New refresh token on each refresh

```typescript
interface JWTPayload {
  sub: string;        // User ID
  email: string;
  role: string;
  iat: number;
  exp: number;
}
```

#### Registration Flow
```
1. User submits email/phone + password
2. Backend validates and hashes password (bcrypt)
3. Creates user record
4. Sends verification email/SMS
5. Returns tokens (access + refresh)
6. User verifies email/phone via link/code
```

#### Login Flow
```
1. User submits email/phone + password
2. Backend validates credentials
3. Checks if email/phone is verified
4. Generates access + refresh tokens
5. Logs device info
6. Returns tokens
```

#### OAuth Flow (Google/Apple)
```
1. Mobile app initiates OAuth (Google/Apple SDK)
2. User authenticates with provider
3. App receives ID token
4. App sends ID token to backend
5. Backend validates token with provider
6. Creates or updates user record
7. Returns our JWT tokens
```

### Security Best Practices

- **Password hashing**: bcrypt with salt rounds = 10
- **Rate limiting**:
  - Login: 5 attempts per 15 minutes
  - API calls: 100 requests per minute per user
- **Input validation**: class-validator on all DTOs
- **SQL injection**: Using ORM with parameterized queries
- **XSS prevention**: Sanitize user inputs
- **CORS**: Whitelist mobile app origins
- **HTTPS only**: SSL/TLS encryption
- **Helmet.js**: Security headers
- **Secrets management**: Environment variables, AWS Secrets Manager
- **PII encryption**: Encrypt sensitive data at rest
- **Audit logging**: Log all critical operations

### Authorization (RBAC)

```typescript
enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  MANAGER = 'manager',
  OWNER = 'owner',
  ADMIN = 'admin',
}

@Roles(UserRole.OWNER, UserRole.MANAGER)
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
async updateMenu() { ... }
```

---

## Payment Integration

### Payment Providers

#### 1. Iyzico (Primary for Turkey)
- Credit/debit cards
- 3D Secure
- Installments
- Webhooks for payment status

#### 2. Stripe (International/Future)
- Credit/debit cards
- Apple Pay / Google Pay
- Subscription billing

### Payment Flow

```
1. User adds items to cart
2. User proceeds to checkout
3. Frontend requests payment intent from backend
4. Backend creates payment intent with Iyzico/Stripe
5. Frontend presents payment UI (card input / Apple Pay)
6. User completes payment
7. Provider validates payment
8. Provider sends webhook to backend
9. Backend updates order status
10. Backend notifies user via push/email
```

### Apple Pay / Google Pay

**iOS (Apple Pay):**
```typescript
// React Native implementation
import { PaymentRequest } from 'react-native-payments';

const paymentRequest = new PaymentRequest(methodData, details);
const paymentResponse = await paymentRequest.show();
```

**Android (Google Pay):**
```typescript
// React Native implementation
import { GooglePay } from 'react-native-google-pay';

const paymentData = await GooglePay.requestPayment({
  totalPrice: '15.50',
  currencyCode: 'TRY',
});
```

### Refund Handling
- Full refunds within 24 hours
- Partial refunds for cancelled items
- Automatic refund to original payment method
- Wallet credit option

---

## Real-time Features

### WebSocket Implementation (Socket.io)

#### Order Tracking
```typescript
// orders.gateway.ts
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'orders',
})
export class OrdersGateway {
  @SubscribeMessage('subscribe:order')
  handleSubscribe(client: Socket, orderId: string) {
    client.join(`order:${orderId}`);
  }

  async notifyOrderStatusChange(orderId: string, status: OrderStatus) {
    this.server.to(`order:${orderId}`).emit('order:status_changed', {
      orderId,
      status,
      timestamp: new Date(),
    });
  }
}
```

#### Shop Dashboard (for staff)
```typescript
@SubscribeMessage('subscribe:shop')
handleShopSubscribe(client: Socket, tenantId: string) {
  // Verify user is staff of this tenant
  client.join(`shop:${tenantId}`);
}

async notifyNewOrder(tenantId: string, order: Order) {
  this.server.to(`shop:${tenantId}`).emit('shop:new_order', order);
}
```

### Server-Sent Events (Alternative)
For one-way updates (server → client):
```typescript
@Get('orders/:id/stream')
async streamOrderUpdates(@Param('id') orderId: string, @Res() res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Stream updates
}
```

---

## Notification System

### Multi-Channel Notifications

#### Push Notifications (Firebase Cloud Messaging)
```typescript
async sendPushNotification(userId: string, notification: PushNotificationDto) {
  const devices = await this.userDeviceRepository.find({
    where: { userId, isActive: true },
  });

  const tokens = devices.map(d => d.deviceToken);

  await this.fcmService.sendMulticast({
    tokens,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.data,
  });
}
```

#### SMS Notifications (Twilio/Netgsm)
```typescript
async sendSMS(phone: string, message: string) {
  await this.twilioClient.messages.create({
    to: phone,
    from: this.configService.get('TWILIO_PHONE'),
    body: message,
  });
}
```

#### Email Notifications (SendGrid)
```typescript
async sendEmail(to: string, templateId: string, data: any) {
  await this.sendGridClient.send({
    to,
    from: 'noreply@coffeapp.com',
    templateId,
    dynamicTemplateData: data,
  });
}
```

### Notification Types & Triggers

| Notification Type | Trigger | Channels |
|-------------------|---------|----------|
| Order Confirmed | Order placed & paid | Push, Email |
| Order Preparing | Status → preparing | Push |
| Order Ready | Status → ready | Push, SMS |
| Order Completed | Status → completed | Push |
| Points Earned | Order completed | Push |
| Reward Available | Points threshold reached | Push, Email |
| Promotion | Shop creates promo | Push |
| Review Reminder | 24h after order completion | Push |

### Notification Preferences
Users can control:
- Push notifications on/off
- Email notifications on/off
- SMS notifications on/off
- Marketing communications on/off
- Per-shop notification settings

---

## Analytics & Reporting

### Metrics to Track

#### For Coffee Shops (Admin Dashboard)
- **Sales metrics**:
  - Daily/Weekly/Monthly revenue
  - Average order value
  - Orders per hour (peak times)
  - Revenue by category/item

- **Customer metrics**:
  - New vs. returning customers
  - Customer lifetime value
  - Retention rate
  - Loyalty tier distribution

- **Product metrics**:
  - Best-selling items
  - Worst-performing items
  - Out-of-stock frequency
  - Customization preferences

- **Operational metrics**:
  - Average preparation time
  - Order cancellation rate
  - Refund rate
  - Staff performance

#### For Platform (Super Admin)
- Total GMV (Gross Merchandise Value)
- Active tenants
- Active users
- Orders per tenant
- Commission revenue
- Churn rate (tenants)

### Implementation

```typescript
// Simple event tracking
await this.analyticsService.track({
  event: 'order_completed',
  userId,
  tenantId,
  properties: {
    orderId,
    totalAmount,
    itemCount,
    paymentMethod,
  },
});

// Aggregated queries for dashboard
async getDailyRevenue(tenantId: string, date: Date) {
  return this.orderRepository
    .createQueryBuilder('order')
    .select('SUM(order.total_amount)', 'revenue')
    .where('order.tenant_id = :tenantId', { tenantId })
    .andWhere('DATE(order.created_at) = :date', { date })
    .andWhere('order.status = :status', { status: 'completed' })
    .getRawOne();
}
```

---

## Deployment & Infrastructure

### Environment Architecture

```
Development → Staging → Production
```

#### Development
- Local Docker Compose
- PostgreSQL + Redis containers
- Hot reload enabled
- Debug logging

#### Staging
- AWS/DigitalOcean
- Mirrors production setup
- Testing environment
- Sample data

#### Production
- Kubernetes cluster (or Docker Swarm)
- Load-balanced API servers (3+ replicas)
- PostgreSQL (managed service: AWS RDS/DigitalOcean Managed DB)
- Redis cluster
- CDN for static assets (CloudFront/Cloudflare)
- Object storage (AWS S3)

### Docker Setup

**docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/coffeapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: coffeapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run tests
        run: npm run test

      - name: Build Docker image
        run: docker build -t coffeapp-api:${{ github.sha }} .

      - name: Push to registry
        run: docker push coffeapp-api:${{ github.sha }}

      - name: Deploy to production
        run: kubectl set image deployment/api api=coffeapp-api:${{ github.sha }}
```

### Monitoring & Logging

- **APM**: New Relic / DataDog
- **Error tracking**: Sentry
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics**: Prometheus + Grafana
- **Uptime monitoring**: UptimeRobot / Pingdom
- **Alerts**: PagerDuty / Opsgenie

### Backup Strategy

- **Database backups**: Daily automated backups (retained 30 days)
- **Point-in-time recovery**: Enabled on PostgreSQL
- **S3 versioning**: Enabled for object storage
- **Disaster recovery plan**: Multi-region backup

---

## Development Phases

### Phase 1: MVP (8-10 weeks)

**Week 1-2: Project Setup & Core Infrastructure**
- [ ] Initialize NestJS project
- [ ] Database schema & migrations
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Basic deployment

**Week 3-4: Authentication & User Management**
- [ ] User registration/login
- [ ] JWT implementation
- [ ] Email/phone verification
- [ ] Password reset
- [ ] OAuth (Google, Apple)

**Week 5-6: Tenant & Menu Management**
- [ ] Tenant CRUD
- [ ] Branding management
- [ ] Menu categories & items
- [ ] Customization options
- [ ] Image upload (S3)

**Week 7-8: Order System**
- [ ] Cart management
- [ ] Order creation
- [ ] Order status workflow
- [ ] Order history

**Week 9-10: Payment Integration**
- [ ] Iyzico integration
- [ ] Payment intent flow
- [ ] Webhook handling
- [ ] Transaction history

**Week 11-12: Basic Loyalty**
- [ ] Points accrual
- [ ] Loyalty balance
- [ ] Simple rewards

**Week 13-14: Mobile App (React Native) - MVP**
- [ ] App structure & navigation
- [ ] Authentication screens
- [ ] Shop discovery & detail
- [ ] Menu browsing
- [ ] Cart & checkout
- [ ] Order tracking
- [ ] Profile management

**Week 15-16: Testing & Launch Preparation**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Soft launch with beta users

### Phase 2: Growth Features (8-10 weeks)

**Features:**
- [ ] Real-time order tracking (WebSocket)
- [ ] Push notifications (FCM)
- [ ] QR code ordering
- [ ] Review & rating system
- [ ] Advanced loyalty (tiers, rewards)
- [ ] Analytics dashboard (shop owners)
- [ ] Scheduled/pre-orders
- [ ] Apple Pay / Google Pay

### Phase 3: Scale & Advanced Features (12+ weeks)

**Features:**
- [ ] Geofencing & location-based notifications
- [ ] Social features (share, gift coffee)
- [ ] Subscription plans (monthly coffee passes)
- [ ] AI-powered recommendations
- [ ] Multi-location support (chains)
- [ ] Delivery integration
- [ ] Advanced analytics & ML insights
- [ ] White-label solution for individual shops
- [ ] Staff mobile app (order management)

---

## Performance Requirements

### API Performance
- **Response time**: < 200ms (p95)
- **Throughput**: 1000+ requests/second
- **Database queries**: < 50ms (p95)
- **Concurrent users**: 10,000+

### Mobile App Performance
- **App launch**: < 2 seconds (cold start)
- **Screen transitions**: 60 FPS
- **Image loading**: Progressive with placeholders
- **Offline support**: Core features work offline

### Database Performance
- **Connection pooling**: 20-100 connections
- **Query optimization**: All queries under 50ms
- **Indexes**: Properly indexed foreign keys
- **Caching**: Redis for frequently accessed data

### Scalability Targets
- **Year 1**: 10 coffee shops, 1,000 users, 100 orders/day
- **Year 2**: 100 coffee shops, 10,000 users, 1,000 orders/day
- **Year 3**: 500 coffee shops, 50,000 users, 5,000 orders/day

---

## Appendix

### Technology Alternatives Considered

| Category | Chosen | Alternatives Considered |
|----------|--------|-------------------------|
| Backend Framework | NestJS | Express, Fastify, FastAPI (Python) |
| Database | PostgreSQL | MySQL, MongoDB, CockroachDB |
| Mobile | React Native | Flutter, Native iOS/Android |
| Cache | Redis | Memcached, DragonflyDB |
| Queue | Bull (Redis) | RabbitMQ, AWS SQS, Kafka |
| Search | Elasticsearch | Algolia, Meilisearch, Typesense |
| Storage | AWS S3 | MinIO, DigitalOcean Spaces |

### Third-Party Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Payment | Iyzico | Turkish payment processing |
| Push Notifications | Firebase (FCM) | Mobile push |
| SMS | Twilio / Netgsm | OTP, notifications |
| Email | SendGrid | Transactional email |
| Maps | Google Maps | Location services |
| Error Tracking | Sentry | Error monitoring |
| APM | New Relic | Performance monitoring |
| CDN | Cloudflare | Static assets |

### Estimated Costs (Monthly)

**Small scale (10 shops, 1K users):**
- Infrastructure: $100-200
- Third-party services: $50-100
- **Total**: ~$200/month

**Medium scale (100 shops, 10K users):**
- Infrastructure: $500-800
- Third-party services: $200-400
- **Total**: ~$1,000/month

**Large scale (500 shops, 50K users):**
- Infrastructure: $2,000-3,000
- Third-party services: $800-1,200
- **Total**: ~$4,000/month

---

**Document Version:** 1.0
**Last Updated:** November 15, 2025
**Author:** Technical Team
**Status:** Draft for Review
