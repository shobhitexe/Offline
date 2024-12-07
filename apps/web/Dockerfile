FROM node:20-alpine
 
WORKDIR /usr/src/app
 

COPY package.json ./
COPY package-lock.json ./
COPY turbo.json ./



COPY apps/web/package.json ./apps/web/package.json
 
RUN npm install
 

COPY apps/web ./apps/web
COPY packages ./packages

 
EXPOSE 3000
 
CMD [ "sh", "-c", "npm run build:web && npm run start:web" ]