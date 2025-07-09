# Etapa 1: Build de Astro con Node.js
FROM node:20-slim AS builder

# Crea un entorno de trabajo no-root
WORKDIR /app

# Copia solo lo necesario para instalar dependencias primero (mejor cache)
COPY package*.json ./
RUN npm install --frozen-lockfile

# Ahora copia el resto del código
COPY . .

# Build del sitio Astro
RUN npm run build

# Etapa 2: Imagen de producción con Nginx
FROM nginx:stable-alpine

# Borra archivos temporales, reduce superficie de ataque
RUN rm -rf /etc/nginx/conf.d && mkdir /etc/nginx/conf.d

# Copia los archivos estáticos generados por Astro
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia tu configuración optimizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Exponer puerto web
EXPOSE 80

# Usa nginx como proceso principal
CMD ["nginx", "-g", "daemon off;"]
