FROM node:20-alpine

# 1️⃣ Herramientas necesarias para Prisma
RUN apk add --no-cache openssl

# 2️⃣ Nest CLI (ok para dev)
RUN npm install -g @nestjs/cli

# 3️⃣ Directorio de trabajo
WORKDIR /usr/src/app

# 4️⃣ Copiar dependencias
COPY package*.json ./

# 5️⃣ Instalar dependencias
RUN npm install

# 6️⃣ Copiar el resto del proyecto
COPY . .

# 7️⃣ Generar Prisma Client
RUN npx prisma generate

# 8️⃣ Exponer puerto
EXPOSE 3000

# 9️⃣ Arranque
CMD ["npm", "run", "start:dev"]