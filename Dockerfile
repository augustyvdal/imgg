FROM node:20-slim AS builder

WORKDIR /app

# copy only package files first for better caching
COPY package*.json ./

# clean install and fix rollup
RUN npm cache clean --force \
    && rm -rf node_modules package-lock.json \
    && npm install \
    && npm install rollup --force

# cpy source code
COPY . .

# Build Vite app
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]