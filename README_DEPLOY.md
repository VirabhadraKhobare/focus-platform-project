# Deployment Notes

- You can deploy frontend to Vercel and backend to Render/Railway.
- For Render:
  - Create a Web Service for backend (Node). Set build: `npm run build && npm run start`, set env `MONGODB_URI` and `JWT_SECRET`.
  - Create a Static Site for frontend (build command `npm run build`, publish `dist`).
- Docker Compose is included for local containerized testing.
