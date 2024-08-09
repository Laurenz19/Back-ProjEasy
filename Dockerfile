FROM node:18
ENV NODE_ENV=development

WORKDIR /src

RUN npm i npm@latest -g

COPY package.json package-lock*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]