FROM node:20-alpine
WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Arrancamos con --host para que Docker pueda "sacar" el puerto a tu navegador
CMD ["npm", "run", "dev", "--", "--host"]
