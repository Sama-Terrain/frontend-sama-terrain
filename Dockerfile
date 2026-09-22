# Image de base : Node léger, suffisant pour Vite/React.
FROM node:22-alpine

WORKDIR /app

# On copie d'abord uniquement package*.json : Docker met cette étape en
# cache, donc `npm install` ne se relance pas à chaque changement de code,
# seulement quand les dépendances changent (même logique que le Dockerfile backend).
COPY package.json package-lock.json ./
RUN npm install

# Le reste du code du frontend (écrasé par le volume monté en dev, voir
# docker-compose.yml : cette copie sert surtout si l'image est buildée seule).
COPY . .

EXPOSE 5173

# --host : indispensable dans un conteneur, sinon Vite n'écoute que sur
# localhost et reste injoignable depuis l'extérieur du conteneur.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
