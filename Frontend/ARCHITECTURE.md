# Architecture

## Overview

Feature-based modular architecture. Every business concern lives in its own folder under `src/features/`.

## Frontend Structure

\`\`\`
Frontend/src/
├── app/                          # Next.js routes (THIN — 3 lines each)
│   ├── page.tsx                  → imports HomePage from @/features/home
│   ├── ingia/page.tsx            → imports LoginPage
│   ├── admin/                    → imports admin feature pages
│   └── (guest)/                  → imports guest feature pages
│
├── features/                     # ⭐ Business logic (one folder per feature)
│   ├── payments/
│   │   ├── api/paymentsApi.ts
│   │   ├── components/
│   │   │   ├── AdminPaymentsPage.tsx   ← main page
│   │   │   ├── PaymentCard.tsx
│   │   │   ├── VerifyModal.tsx
│   │   │   └── modal/                  ← modal subcomponents
│   │   │       ├── ModalHeader.tsx
│   │   │       ├── ModalFooter.tsx
│   │   │       ├── VerifyForm.tsx
│   │   │       └── RejectForm.tsx
│   │   ├── hooks/usePayments.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── index.ts              ← barrel export
│   │
│   ├── invitations/              # Admin invites + PDF export
│   ├── orders/                   # Order management
│   ├── uniforms/                 # Fabric catalog + editable orders
│   ├── audit/                    # Audit logs
│   ├── dashboard/                # Admin dashboard
│   ├── settings/                 # Settings
│   ├── auth/                     # Login
│   ├── catalog/                  # Fabric catalog
│   ├── product-detail/           # Product page
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout form
│   ├── payment-flow/             # Lipa kwa Mix flow
│   ├── my-orders/                # Guest orders
│   ├── my-invitation/            # Invitation card
│   ├── contact/                  # Contact page
│   └── home/                     # Landing page
│
├── components/                   # SHARED UI
│   ├── ui/                       # AdminButton, Badge, Input, Container
│   ├── primitives/               # PageHeader, EmptyState, LoadingState
│   ├── layout/                   # Navbar, Footer, ContactBanner
│   ├── admin/                    # AdminSidebar + subcomponents
│   ├── guest/                    # GuestSidebar + InvitationCard
│   └── features/                 # ThemeToggle, LanguageSwitch
│
├── lib/                          # Core utilities
│   ├── api.ts                    # Axios + interceptors
│   ├── i18n.tsx                  # Swahili/English provider
│   ├── store.ts                  # Zustand (auth + cart)
│   ├── themes.ts                 # Theme tokens
│   └── utils.ts                  # Formatters
│
├── providers/                    # Root providers
├── locales/                      # Translation JSON (sw, en)
└── types/                        # Global types
\`\`\`

## Rules

1. **Routes stay thin** — every `page.tsx` is 3-5 lines, imports a feature page
2. **One folder per feature** — no cross-feature imports except from `@/components/ui` and `@/lib`
3. **Every feature exports via `index.ts`** — clean import paths
4. **No file over 100 lines** in features (split by component)
5. **Translations live with their feature** — `constants.ts` per feature + global `locales/`

## Backend Structure (already modular)

\`\`\`
Backend/src/modules/
├── auth/
├── tenants/
├── users/
├── categories/
├── products/
├── orders/
├── payments/
├── invitations/
├── uniforms/
├── audit/
├── admin/
├── sms/
└── upload/
\`\`\`

## Adding a New Feature

\`\`\`bash
# 1. Create feature folder
mkdir -p src/features/<feature-name>/{components,hooks,api}

# 2. Create types.ts, constants.ts, api/, hooks/, components/

# 3. Barrel export in index.ts

# 4. Create thin route
# src/app/<path>/page.tsx:
#   import { XxxPage } from '@/features/<feature-name>';
#   export default function Page() { return <XxxPage />; }
\`\`\`

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS 3, Framer Motion, Zustand, i18next
- **Backend:** NestJS 10, PostgreSQL 18, TypeORM, JWT, i18next
- **Fonts:** Playfair Display, Inter, Great Vibes, Cormorant Garamond
- **PDF:** jsPDF + jspdf-autotable
