# Сборка
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Раздача статики через легковесный nginx
FROM nginx:stable-alpine
# Копируем билд фронта в папку для статики
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем твой конфиг nginx (который мы правили выше)
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]