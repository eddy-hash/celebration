#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   Celebration — Dev Reset              ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

if [[ ! "$PWD" == *"/SaaS/celebration"* ]]; then
  echo -e "${RED}❌ Run from ~/SaaS/celebration${NC}"
  echo -e "   Current: $PWD"
  exit 1
fi
echo -e "${GREEN}✅ Location: $PWD${NC}"

echo ""
echo -e "${YELLOW}🛑 Stopping dev servers...${NC}"
pkill -f "next dev" 2>/dev/null || true
pkill -f "nest start" 2>/dev/null || true
sleep 1
echo -e "${GREEN}✅ Stopped${NC}"

echo ""
echo -e "${YELLOW}🧹 Clearing Frontend...${NC}"
cd Frontend
rm -rf .next node_modules/.cache
echo -e "${GREEN}✅ Cleared${NC}"

echo ""
echo -e "${YELLOW}🧹 Clearing Backend...${NC}"
cd ../Backend
rm -rf dist
echo -e "${GREEN}✅ Cleared${NC}"

echo ""
echo -e "${YELLOW}🔍 Checking .env files...${NC}"
[ -f ".env" ] && echo -e "${GREEN}✅ Backend .env${NC}" || echo -e "${RED}⚠️  Backend .env missing${NC}"
[ -f "../Frontend/.env.local" ] && echo -e "${GREEN}✅ Frontend .env.local${NC}" || echo -e "${RED}⚠️  Frontend .env.local missing${NC}"

echo ""
echo -e "${YELLOW}🗄️  PostgreSQL...${NC}"
if systemctl is-active --quiet postgresql; then
  echo -e "${GREEN}✅ Running${NC}"
else
  echo -e "${RED}⚠️  Starting...${NC}"
  sudo systemctl start postgresql
  sleep 2
  echo -e "${GREEN}✅ Started${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ✅ Reset complete                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}👉 Next steps:${NC}"
echo ""
echo "  Terminal 1:"
echo "    cd ~/SaaS/celebration/Backend && npm run start:dev"
echo ""
echo "  Terminal 2:"
echo "    cd ~/SaaS/celebration/Frontend && npm run dev"
echo ""
echo "  Browser: http://localhost:3000"
echo "           Ctrl + Shift + R"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
