FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV NODE_ENV=production

# The project includes a standalone JS server `stable-backend.js` used for
# quick deployment (doesn't require transpiling TypeScript). Use it as the
# container start command so the image doesn't fail when `dist/index.js` is
# absent.
CMD ["node","stable-backend.js"]
