# Erick Edsoni Baptism Celebration

Multi-tenant SaaS platform for baptism celebrations in Tanzania.

## Structure

    celebration/
    ├── Backend/     # NestJS + PostgreSQL + TypeORM
    ├── Frontend/    # Next.js 16 + Tailwind + Framer Motion
    └── scripts/     # Dev utilities

## Quick Start

### Backend

    cd ~/SaaS/celebration/Backend
    npm install
    cp .env.example .env
    # edit .env with your Postgres password
    npm run seed
    npm run start:dev

### Frontend

    cd ~/SaaS/celebration/Frontend
    npm install
    cp .env.local.example .env.local
    npm run dev

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Swagger: http://localhost:3001/api/docs

## Credentials

- Admin: 0692506552 / 2014
- Payment: Mixx by Yas 15714656

## Bug? Read

- `TROUBLESHOOTING.md`
- Run `./scripts/dev-reset.sh`

## Celebration

ERICK EDSONI · 08 November 2026

## Contact

- 0710 209 220
- 0692 506 552
