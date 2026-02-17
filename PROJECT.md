# KURA B2C Web — Project Instructions

## Role
Patient-facing commerce portal. Mobile-first, accessibility-focused (older adults).

## Architecture
- **Angular 20** / Tailwind CSS / Standalone components
- **Port:** 4200
- **API:** `kura-b2c-api` at `http://localhost:8081/api/v1`

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured services, trust indicators |
| `/search` | Service search (pg_trgm), bundle comparison, add to cart |
| `/auth/login` | Email + password login |
| `/auth/register` | OTP → RNEC → register (Ley 1581 consent) |
| `/checkout` | Cart → guest or user checkout → walk-in ticket |
| `/orders` | User order history |
| `/share/:uuid` | Public result share (no auth) |

## Design Language
- **Primary:** Trust Medical Blue `#0ea5e9` (sky-500)
- **Accent:** Emerald Green `#10b981` (emerald-500)
- **Background:** White / gray-50
- **Typography:** Large for accessibility, rounded elements
- **Mobile-first:** Tailwind responsive utilities

## Key Behaviors
- Cart enforces single PoS per order
- Walk-in ticket: 15-day expiry, prominent display
- Bundle comparison: side-by-side table with ✅ icons
- i18n: Spanish hardcoded for MVP, ngx-translate Phase 2

## Standards
- All components standalone
- Lazy-loaded routes
- Reactive forms for all inputs
- HttpClient via environment-based API URL
