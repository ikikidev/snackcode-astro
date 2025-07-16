# Etapa 1: Build de Astro con Node.js
FROM node:20-slim AS builder

WORKDIR /app

# Copiar solo lo esencial primero
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# ✅ IMPORTANTE: hacer el build del sitio
RUN npm run build


# Etapa 2: Imagen de producción con Nginx
FROM nginx:stable-alpine

RUN rm -rf /etc/nginx/conf.d && mkdir /etc/nginx/conf.d

# Copiar archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto web
EXPOSE 80

# ✅ Script para esperar a MySQL
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

# ✅ Comando final: espera MySQL y luego lanza nginx
CMD ["/wait-for-mysql.sh", "nginx", "-g", "daemon off;"]
