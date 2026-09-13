# 🚆 RailGaadi — Indian Railway Intelligence Platform

<p align="center">
  <strong>Real-Time Train Telemetry • Route Vector Mapping • Station Split-Flap Display • Delay Analytics • Weather Context</strong>
</p>

---

## 📌 Product Vision

**RailGaadi** is a production-grade Indian Railway Intelligence Platform engineered with a focus on speed, clarity, WCAG 2.2 AA accessibility, data integrity, and resilience under network failures.

The application communicates one clear message: **"Everything you need to understand your train journey, in one place."**

---

## ✨ Key Features

- 🔎 **Instant Combobox Search**: Search by train number (`12951`, `22436`) or name (`Rajdhani`, `Shatabdi`) with `⌘ K` keyboard shortcuts, ARIA combobox accessibility, and offline static DB fallback.
- 🚆 **Live Telemetry & Station Timelines**: Scheduled vs actual arrival/departure timestamps, platform numbers, and status indicators (On Time, Delayed, Cancelled).
- 🗺️ **Vector Map Tracking**: MapLibre GL dark vector maps with animated train marker telemetry, route line glow, station popups, and follow-camera controls.
- 📊 **Topographical & Delay Analytics**: Elevation profile charts across Indian geographical corridors (Western Ghats, Gangetic Plains, Aravallis) and station-by-station delay histories.
- 🌦️ **Contextual Weather Intelligence**: Weather telemetry for current position and upcoming station stops.
- 🎫 **Digital PNR Boarding Pass**: Interactive PNR wallet with real-time boarding countdown timer and IRCTC barcode verification simulator.
- 🍱 **Seat Meal & Coach Layout Simulators**: Interactive coach position layouts and seat meal ordering simulators.
- ⚡ **Redis & Sliding Window Rate-Limiting**: Upstash Redis caching with in-memory fallbacks and distributed API rate-limiting (`429 Too Many Requests`).
- 🛡️ **Strict Real Data Policy**: Explicit isolation of live data vs simulation/demo modes — no hidden fake tracking.

---

## 🏗️ Architecture & Data Flow

```
                               ┌────────────────────────────────┐
                               │     Browser Client (Next.js)   │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                              ┌──────────────────────────────────┐
                              │    Next.js API Routes (/api/*)   │
                              └────────────────┬─────────────────┘
                                               │
                       ┌───────────────────────┼────────────────────────┐
                       ▼                       ▼                        ▼
           ┌──────────────────────┐ ┌─────────────────────┐  ┌─────────────────────┐
           │ Upstash Redis / Cache│ │ Rate Limiter (429)  │  │ Real Data Validator │
           └──────────────────────┘ └─────────────────────┘  └──────────┬──────────┘
                                                                        │
                                                                        ▼
                                                             ┌─────────────────────┐
                                                             │ RailRadar / Weather │
                                                             │   OpenTopography    │
                                                             └─────────────────────┘
```

---

## 🛡️ Real Data Policy & Security

1. **Private API Key Isolation**: All external private API keys (`RAILRADAR_API_KEY`, `OPENWEATHER_API_KEY`, `OPENTOPOGRAPHY_API_KEY`, `UPSTASH_REDIS_REST_*`) remain strictly server-side inside API routes (`/api/*`). The browser client only consumes public vector tile keys.
2. **Transparent Data Transparency**: Live tracking displays verified railway data. Fallback/simulation data is strictly isolated behind `isDemoData: true` and explicitly labeled in the UI.

---

## 🧰 Tech Stack

| Domain | Technologies |
|---|---|
| **Core Framework** | Next.js 14 (App Router), React 18, TypeScript 5 |
| **Styling & UI** | Vanilla Tailwind CSS, Class Variance Authority (CVA), Lucide Icons |
| **State & Cache** | TanStack React Query 5, Zustand 4, Upstash Redis REST |
| **Geospatial & Vector Maps** | MapLibre GL JS, Turf.js, OpenTopography, Overpass API |
| **Animation** | Framer Motion 11 |
| **Testing** | Vitest |

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the repository root:

```env
# RailRadar Live Railway Intelligence API Key
RAILRADAR_API_KEY=your_railradar_api_key

# Public MapTiler Key for Dark Vector Tiles
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key

# OpenWeather API Key (Server-Side Only)
OPENWEATHER_API_KEY=your_openweather_api_key

# OpenTopography Key (Server-Side Only)
OPENTOPOGRAPHY_API_KEY=your_opentopography_api_key

# Upstash Redis REST Credentials (Server-Side Only)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Optional: Enable Demo Simulation Mode Fallback in Development
ALLOW_DEMO_DATA=false
```

---

## 🚀 Local Development Setup

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/faizanalam-1457/RailGaadi-Train-Tracking-System.git
   cd RailGaadi-Train-Booking-System
   npm install
   ```

2. **Run TypeScript Type Check & Unit Tests**:
   ```bash
   ./node_modules/.bin/tsc --noEmit
   npm test
   ```

3. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build & Launch**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Testing

Run unit tests via Vitest:
```bash
npm test
```
The test suite validates:
- Train number and name search queries (`TRAINS_DB`).
- Delay formatting utilities (`formatDelay`).
- RailRadar service real data policy compliance (`generateFallbackJourney`).

---

## 📄 License

MIT License. Designed and engineered for Indian Railway Intelligence.
