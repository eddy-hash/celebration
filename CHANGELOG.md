# Changelog

## [Unreleased]

### Added
- Multi-tenant architecture
- Unified login (admin password / guest invite code)
- Invitation management + WhatsApp share
- Manual Lipa kwa Mixx by Yas payment flow
- Admin dashboard with analytics + audit logs
- Kitambaa delivery tracking
- Swahili + English i18n

### Fixed
- Admin token routing for /invitations (trailing slash bug)
- Home page JSX structure

### Changed
- Guest pages moved to (guest) route group
- Heroicons instead of emojis
- Mobile-first responsive

## [1.0.0] - 2026-10-15

### Added
- Initial release
- Backend (NestJS + PostgreSQL + TypeORM)
- Frontend (Next.js 16 + Tailwind + Framer Motion)
- 9 tables, seed data, 2 kitambaa products (20,000 TZS)
