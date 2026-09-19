# Kauno teniso klubas

Next.js 16 + Prisma (SQLite) + NextAuth svetainė su viešu turiniu ir `/admin` CMS.

## Greitas startas (lokalūs)

```bash
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Atidarykite http://localhost:3000 (arba :3001, jei taip paleista).

Demo po seed:
- Admin: `ADMIN_EMAIL` / `ADMIN_PASSWORD` iš `.env`
- Narys: `narys@kaunotenisas.lt` / `Narys1924!` (tik development)

## Aplinkos kintamieji

Žr. `.env.example`:

| Kintamasis | Paskirtis |
|---|---|
| `DATABASE_URL` | SQLite kelias, pvz. `file:./dev.db` |
| `AUTH_SECRET` | Sesijų raktas (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | `true` už reverse proxy |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Pirmo admin sukūrimas seed metu |

## Docker (produkcija / laikinas hostingas)

```bash
export AUTH_SECRET="$(openssl rand -base64 32)"
export ADMIN_PASSWORD="stiprus-slaptazodis"
docker compose up --build -d
```

- Seed paleidžiamas **tik kai DB tuščia** (nėra userių).
- Duomenys: volume `ktk-data` (`/data/prod.db`), uploadai: `ktk-uploads`.
- Backup: nukopijuokite `/data/prod.db` iš volume.

## SEO

`/admin/nustatymai` → skiltis **SEO**:
- Site URL, title, description, raktazodžiai
- Puslapių SEO JSON (`/` , `/turnyrai`, …)
- Automatiniai `/sitemap.xml` ir `/robots.txt`

## Turnyrų registracija

1. Turnyro statusas: „Registracija atidaryta“
2. `/admin/turnyrai/[slug]/registracija` — įjunkite formą ir partnerį
3. Viešai: `/turnyrai/[slug]#registracija`

## Kur patalpinti laikinai

Geriausiai tinka Docker + SQLite:

1. **Railway** / **Render** / **Fly.io** — deploy iš GitHub, prijunkite volume DB failui
2. **Hetzner / DigitalOcean VPS** — `docker compose up` ant pigaus serverio
3. **Cloudflare Tunnel** — laikinai parodyti lokalų `:3000` be viešo VPS

Vercel serverless SQLite netinka be Postgres (Neon) migracijos.

## Naudingos komandos

```bash
npm run db:studio   # Prisma Studio
npm run build       # produkcijos build
npx tsx scripts/recompute-player-career.ts
```
