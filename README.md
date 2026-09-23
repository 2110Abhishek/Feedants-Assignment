# Feedants Competition Details Module — Production-Ready Implementation

Full-stack production-ready implementation of the **Feedants Competition Details Module**, reproducing the exact visual design reference and satisfying all architectural invariants, concurrency protections, and server-authoritative lifecycle requirements specified in the PRD.

---

## 1. Project Overview

The **Competition Details Module** allows users to discover a competition, understand its rules, schedule, rewards, and judging parameters, register for participation, view previous winners, understand prize distribution, and submit their participation entries.

The system is built as a **Modular Monolith** backend (Node.js + Express + MongoDB) and an interactive **React Native (Expo)** mobile application supporting Web, Android, and iOS.

---

## 2. Features

- **Pixel-Accurate UI Reproduction**: Faithful reproduction of the Feedants design reference including headers, custom pill badges, 3-column stats card, judge profile card with intro video play trigger, real-time seconds countdown, 2x2 important dates grid, horizontal scrolling previous winners, interactive tabs, rewards breakdown, disclaimer, trust & Razorpay badge, referral card, user feedback section, sticky dynamic CTA button, and 5-tab bottom navigation bar.
- **100% Dynamic Data**: Zero hardcoded competition details. All titles, dates, fees, judges, criteria, rules, prizes, and winners are dynamically fetched from MongoDB via REST APIs.
- **Server-Authoritative Lifecycle**: Competition lifecycle states (`DRAFT`, `UPCOMING`, `REGISTRATION_OPEN`, `REGISTRATION_CLOSED`, `SUBMISSION_OPEN`, `SUBMISSION_CLOSED`, `JUDGING`, `RESULTS_PUBLISHED`, `COMPLETED`) are strictly evaluated on the server using UTC timestamps.
- **Zero Race Conditions on Capacity**: Atomic reservation using MongoDB `$inc` and `$lt` condition coupled with MongoDB transactions and compound unique indexes.
- **Bilingual English & Hindi Support**: Seamless on-screen language toggle between English and Hindi (`ENG` / `हिंदी`).
- **Interactive Mock Payment Flow**: Complete registration flow simulating Razorpay checkout (Pending -> Processing -> Success -> Confirmed).
- **Submission Management**: Registered participants can submit entries with title, performance video link, and description.
- **Evaluator Demo Controls**: Floating interactive drawer (`⚡ Demo Controls`) allowing the evaluator to test all lifecycle states and switch between user personas (`Abhishek` - Registered, `Priya` - Unregistered, `Guest` - Logged Out) on the fly.

---

## 3. Tech Stack

### Frontend
- **Framework**: React Native + Expo (SDK 52)
- **State & Server Cache**: TanStack React Query v5
- **Networking**: Axios with JWT interceptors
- **Icons**: `@expo/vector-icons` (Ionicons, Feather, MaterialCommunityIcons)
- **Storage**: `@react-native-async-storage/async-storage`
- **Platform Support**: Web, Android, iOS

### Backend
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js (Modular Monolith)
- **Database**: MongoDB 8.0 with Mongoose
- **Authentication**: JWT (JSON Web Tokens) & bcrypt password hashing
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Morgan

---

## 4. Architecture

```
                                  FEEDANTS SYSTEM
                                         │
                                         ▼
                               ┌───────────────────┐
                               │   React Native    │
                               │   Expo Frontend   │
                               └─────────┬─────────┘
                                         │ HTTPS / JSON
                                         ▼
                            ┌─────────────────────────┐
                            │    Express API Gateway  │
                            │                         │
                            │ • Helmet & CORS         │
                            │ • Rate Limiters         │
                            │ • JWT Auth Middleware   │
                            │ • Zod Validation        │
                            │ • Central Error Handler │
                            └────────────┬────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
             Competition Module   Registration Module  Submission Module
             • Details & Rules    • Atomic Reservation • Entry Upload
             • Lifecycle Engine   • Duplicate Guard    • Review Pipeline
             • Reviews & Results  • Mock Payment       • Status Tracking
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │    MongoDB      │
                                │                 │
                                │ • users         │
                                │ • competitions  │
                                │ • registrations │
                                │ • submissions   │
                                │ • reviews       │
                                └─────────────────┘
```

---

## 5. Folder Structure

```
Feedants-Assignment/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Mongoose connection & replica set auto-init
│   │   │   └── env.js               # Environment variables
│   │   ├── models/
│   │   │   ├── User.js              # User schema & bcrypt hashing
│   │   │   ├── Competition.js       # Competition schema & virtual spotsRemaining
│   │   │   ├── Registration.js      # Registration schema & unique compound index
│   │   │   ├── Submission.js        # Participant submissions
│   │   │   └── Review.js            # Participant reviews & ratings
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── competition.controller.js
│   │   │   ├── registration.controller.js
│   │   │   └── submission.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── competition.service.js
│   │   │   ├── registration.service.js # Atomic slot reservation logic
│   │   │   └── submission.service.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── competition.routes.js
│   │   │   ├── submission.routes.js
│   │   │   └── system.routes.js     # Time sync, referrals, & dev-lifecycle
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT & optional auth for guests
│   │   │   ├── validation.middleware.js # Zod validator
│   │   │   ├── rateLimit.middleware.js
│   │   │   └── error.middleware.js  # Standardized error responses
│   │   ├── validators/              # Zod validation schemas
│   │   ├── utils/
│   │   │   ├── apiResponse.js       # Standard response formatting
│   │   │   ├── errors.js            # AppError class
│   │   │   └── lifecycle.js         # Lifecycle and CTA state machine
│   │   ├── seed/
│   │   │   └── competition.seed.js  # Exact data from screenshot
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Server entry point
│   ├── tests/
│   │   ├── api.test.js              # Integration & unit test suite
│   │   └── concurrency.test.js      # Critical 20-user race condition test
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Back button, Language pills, Status badge
│   │   │   ├── CompetitionSummary.jsx # Title, Category, Prize, Fee, Spots
│   │   │   ├── JudgeCard.jsx        # Judge avatar, title, Intro Video button
│   │   │   ├── Countdown.jsx        # Real-time ticking countdown timer
│   │   │   ├── ImportantDates.jsx   # 2x2 dates grid
│   │   │   ├── PreviousWinners.jsx  # Horizontal scrolling winners
│   │   │   ├── CompetitionTabs.jsx  # About, Judging Parameters, Rules
│   │   │   ├── Rewards.jsx          # Ranked prizes with icons
│   │   │   ├── Disclaimer.jsx       # Paid participant disclaimer banner
│   │   │   ├── TrustSection.jsx     # Prize video card & Razorpay badge
│   │   │   ├── ReferralCard.jsx     # Referral URL & share action
│   │   │   ├── ReviewsSection.jsx   # User feedback trigger
│   │   │   ├── AdBanner.jsx         # Ad placeholder
│   │   │   ├── PrimaryCTA.jsx       # Sticky dynamic state-driven action button
│   │   │   ├── BottomNavigation.jsx # 5 bottom tabs
│   │   │   ├── PaymentModal.jsx     # Simulated Razorpay checkout
│   │   │   ├── SubmissionModal.jsx  # Entry submission form
│   │   │   ├── VideoModal.jsx       # Video stream preview
│   │   │   ├── DevLifecycleSwitcher.jsx # Evaluator state toggle
│   │   │   ├── SkeletonLoader.jsx   # Skeleton loading state
│   │   │   └── ErrorView.jsx        # Offline & API error state
│   │   ├── api/                     # Axios client & endpoints
│   │   ├── hooks/                   # React Query custom hooks
│   │   ├── constants/               # Translations (English & Hindi)
│   │   ├── theme/                   # Colors & styling tokens
│   │   ├── utils/                   # Date & currency helpers
│   │   └── screens/
│   │       └── CompetitionDetailsScreen.jsx
│   ├── App.js
│   ├── app.json
│   └── package.json
│
└── README.md
```

---

## 6. Database Schema

### 1. `User` Schema
- `name`: String (required)
- `email`: String (required, unique, indexed)
- `passwordHash`: String (bcrypt hashed)
- `profileImageUrl`: String
- `role`: Enum `["USER", "ADMIN"]` (default: `"USER"`)
- `isActive`: Boolean

### 2. `Competition` Schema
- `title`: String (required)
- `slug`: String (unique index)
- `category`: String (e.g., `"Dance"`)
- `mode`: Enum `["SINGLE_WIN", "MULTI_WIN"]`
- `description`: String
- `winnerCertificate`: Boolean
- `prizePool`: Number
- `entryFee`: Number
- `currency`: String (default: `"INR"`)
- `capacity`: Number (required)
- `registeredCount`: Number (default: `0`)
- `registrationStartAt`: Date (indexed)
- `registrationEndAt`: Date (indexed)
- `submissionStartAt`: Date
- `submissionEndAt`: Date
- `resultDate`: Date
- `status`: Enum `["DRAFT", "PUBLISHED", "COMPLETED"]`
- `judge`: Embedded object `{ name, designation, experienceYears, profileImageUrl, introVideoUrl }`
- `judgingParameters`: Array of `{ name, description, weight }`
- `rules`: Array of `{ title, description }`
- `rewards`: Array of `{ position, amount, title }`
- `previousWinners`: Array of `{ name, position, imageUrl, videoUrl }`
- Virtual: `spotsRemaining = Math.max(0, capacity - registeredCount)`

### 3. `Registration` Schema
- `competitionId`: ObjectId (ref: `Competition`, indexed)
- `userId`: ObjectId (ref: `User`, indexed)
- `status`: Enum `["PENDING", "REGISTERED", "CANCELLED"]`
- `entryFee`: Number (derived from Competition)
- `paymentStatus`: Enum `["NOT_REQUIRED", "PENDING", "PAID", "FAILED", "REFUNDED"]`
- `paymentReference`: String
- `registeredAt`: Date
- **CRITICAL UNIQUE INDEX**: `{ competitionId: 1, userId: 1 }` (guarantees one registration per user per competition)

### 4. `Submission` Schema
- `competitionId`: ObjectId (indexed)
- `userId`: ObjectId (indexed)
- `registrationId`: ObjectId
- `title`: String
- `description`: String
- `mediaUrl`: String
- `thumbnailUrl`: String
- `status`: Enum `["DRAFT", "SUBMITTED", "UNDER_REVIEW", "EVALUATED"]`
- `submittedAt`: Date

---

## 7. API Documentation

### Base URL: `/api/v1`

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/auth/register` | `POST` | Public | Register new user account |
| `/auth/login` | `POST` | Public | Login with email and password |
| `/auth/me` | `GET` | User | Get current logged-in user profile |
| `/competitions` | `GET` | Public | List published competitions |
| `/competitions/:id` | `GET` | Optional | Retrieve competition details & user-specific registration state |
| `/competitions/:id/results` | `GET` | Public | View winners and rank results |
| `/competitions/:id/reviews` | `GET` | Public | View participant reviews |
| `/competitions/:id/register` | `POST` | User | Atomically reserve slot and confirm registration |
| `/competitions/:id/registration` | `GET` | User | View user's registration details |
| `/competitions/:id/submissions` | `POST` | User | Upload submission for competition |
| `/competitions/:id/submissions/me`| `GET` | User | Fetch user's uploaded submission |
| `/system/time` | `GET` | Public | Synchronize client clock with server UTC |
| `/system/referrals` | `POST` | Public | Get referral code and discount link |
| `/system/dev-lifecycle/:id` | `PATCH` | Public | Dev testing endpoint to adjust lifecycle dates |

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Competition details retrieved"
}
```

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "COMPETITION_FULL",
    "message": "This competition is currently full. No spots remaining."
  }
}
```

---

## 8. Environment Variables

### Backend (`server/.env`):
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/feedants?directConnection=true
JWT_SECRET=super-secure-jwt-secret-feedants-2026-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8081
LOG_LEVEL=info
```

### Mobile (`mobile/.env`):
```ini
EXPO_PUBLIC_API_URL=http://127.0.0.1:5000/api/v1
```

---

## 9. Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (v6+)

### 2. Backend Installation
```bash
cd server
npm install
```

### 3. Mobile Installation
```bash
cd mobile
npm install --legacy-peer-deps
```

---

## 10. Running Backend

```bash
cd server
npm run dev
```
Server will start on `http://localhost:5000`.

---

## 11. Running Mobile App

```bash
cd mobile
npx expo start --web
```
Or for Android / iOS:
```bash
npx expo start
```
Scan the QR code in **Expo Go** on your device.

---

## 12. Seed Database

The seed script creates the exact competition and user data seen in the reference screenshot:
```bash
cd server
npm run seed
```

**Created Accounts**:
- **Abhishek (Registered Demo)**: `user@example.com` / `password123`
- **Priya (Unregistered Test User)**: `priya@example.com` / `password123`
- **Admin**: `admin@feedants.com` / `admin123`

---

## 13. Testing

### Run Integration & Unit Tests:
```bash
cd server
npm test
```

### Run Concurrency Race Condition Test:
```bash
cd server
npm run test:concurrency
```

---

## 14. Concurrency Handling Deep-Dive

### The Problem
When a competition has only **1 remaining spot** (`capacity: 10`, `registeredCount: 9`) and **20 users** click "Register" simultaneously, naive implementations that read the count and then insert a record will oversell the competition (e.g., `registeredCount` becomes `29`!).

### The Solution: Multi-Layered Protection
1. **Atomic MongoDB Capacity Check & Reservation**:
   ```javascript
   const competition = await Competition.findOneAndUpdate(
     {
       _id: competitionId,
       status: 'PUBLISHED',
       registrationStartAt: { $lte: now },
       registrationEndAt: { $gt: now },
       $expr: {
         $lt: ['$registeredCount', '$capacity']
       }
     },
     {
       $inc: { registeredCount: 1 }
     },
     { new: true, session }
   );
   ```
   MongoDB guarantees that single document update operations are strictly atomic. Exactly **one** concurrent update succeeds in incrementing from `9` to `10`. The remaining 19 queries fail the condition `$lt: ['$registeredCount', '$capacity']` and return `null`, which immediately maps to HTTP 409 `COMPETITION_FULL`.

2. **Compound Unique Index**:
   `RegistrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });`
   Guarantees that a double-click or simultaneous duplicate request from the same user is rejected at the database engine level.

3. **Multi-Document ACID Transactions**:
   Wraps the capacity update and registration creation inside a single transaction session so that any unexpected abort rolls back atomically.

---

## 15. Assumptions

1. **Visual Reference vs API Contract**: The provided screenshot serves as the UI benchmark; the underlying REST API, data models, and schemas were designed independently to production standards.
2. **Mocked Payment Flow**: Payment is cleanly mocked via an interactive simulated Razorpay dialog, as no real gateway credentials were provided.
3. **Derived Lifecycle**: The lifecycle is strictly derived on the server from UTC timestamps rather than trusting client state.
4. **Media Storage**: Media (intro videos, avatars, submission performances) are stored as URLs rather than binary blobs inside MongoDB.

---

## 16. Trade-offs

- **Modular Monolith vs Microservices**: Modular Monolith was chosen to avoid unnecessary distributed network complexity while maintaining strict domain modularity (Competitions, Registrations, Submissions).
- **Embedded vs Referenced Criteria**: Judging criteria and rules are embedded directly inside the Competition document to minimize expensive joins and aggregations on reads.
- **Polling vs Push**: Countdown is computed on the client via server time offsets rather than aggressive polling every second.

---

## 17. Production Improvements

1. **Redis Caching**: Cache competition details and server time to handle >100,000 read requests per second.
2. **Payment Gateway**: Integrate real Razorpay/Stripe webhooks with idempotent event handlers.
3. **Cloud Object Storage**: AWS S3 / Cloudflare R2 direct pre-signed URL uploads for video submissions.
4. **WebSocket/SSE**: Real-time push updates for live spots remaining during flash registration sales.
