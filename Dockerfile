FROM node AS development

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY package.json  ./
COPY package-lock.json  ./

RUN npm i

COPY . .

ENTRYPOINT ["/entrypoint.sh"]

# Porta do NestJS (ex: 3000) + porta do debug (9229)
EXPOSE 8080 9229

# Start com o inspector
CMD ["node", "--inspect=0.0.0.0:9229", "dist/main.js"]