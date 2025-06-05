# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia los archivos del proyecto al contenedor
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Inicia la aplicación Next.js
CMD ["npm", "run", "dev"]
