FROM node:20
WORKDIR /app/
EXPOSE 8000
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY ./ ./
RUN npm run build
CMD ["npm", "run", "server"]
