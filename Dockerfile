FROM node:20-slim

WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Script para esperar a MySQL
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

# Exponer el puerto de Astro SSR
EXPOSE 4321

# Usar astro preview (SSR) cuando MySQL esté listo
CMD ["/wait-for-mysql.sh", "npm", "run", "preview"]
