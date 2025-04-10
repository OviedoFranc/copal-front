# BUILD IMAGE
FROM node AS build
WORKDIR /app
COPY . /app
RUN npm install && npm run build


FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
