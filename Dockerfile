FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

#Remember to add a config.ts file in the root of the project
COPY . .

RUN npm run build

#Vite preview port
EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"] 

#docker build -t iot-maps-app .
#docker run -d -p 3000:4173 --name iot-maps iot-maps-app
