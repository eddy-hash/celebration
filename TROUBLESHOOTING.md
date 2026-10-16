# Troubleshooting

## Rule #1: Which Folder?

Run: pwd

Must be: /home/mr_discipline/SaaS/celebration/...

## 403 "Admin only"

    cd ~/SaaS/celebration/Frontend
    grep -A 5 "ADMIN_PATHS" src/lib/api.ts

Should show paths WITHOUT trailing slashes:
    const ADMIN_PATHS = ['/admin', '/audit', '/invitations', '/uniforms', '/upload'];

Clear browser + re-login as admin:
    localStorage.clear();
    location.reload();

## "Cannot find module"

    cd ~/SaaS/celebration/Frontend
    rm -rf node_modules .next
    npm install && npm run dev

## Port in use

    pkill -f "next dev"
    pkill -f "nest start"

## DB connection failed

    sudo systemctl start postgresql
    PGPASSWORD='1234' psql -h localhost -U postgres -d erick_baptism -c "SELECT 1;"

## Redirect loop

    localStorage.clear();
    sessionStorage.clear();
    location.href = '/ingia';

## Images missing

    ls ~/SaaS/celebration/Frontend/public/fabric.jpg
    ls ~/SaaS/celebration/Frontend/public/fabric2.jpg
    ls ~/SaaS/celebration/Frontend/public/yas.png

## Hydration error

Defer localStorage reads to useEffect:

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

## Nuclear Reset

    cd ~/SaaS/celebration

    cd Frontend && rm -rf node_modules .next && npm install
    cd ../Backend && rm -rf node_modules dist && npm install

    PGPASSWORD='1234' psql -h localhost -U postgres -c "DROP DATABASE erick_baptism;"
    PGPASSWORD='1234' psql -h localhost -U postgres -c "CREATE DATABASE erick_baptism;"
    cd Backend && npm run seed

## Contact
- 0710 209 220
- 0692 506 552
