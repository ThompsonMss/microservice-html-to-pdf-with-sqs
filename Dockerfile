FROM node:16

WORKDIR /usr/src/app

COPY . .

# Instalando libs necessárias para o puppeteer
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update

# Instalando libs necessárias para o puppeteer
RUN apt-get install libxshmfence1 libglu1 -y

RUN npm install

RUN npm install -g nodemon

VOLUME ["/usr/src/app/node_modules"]

EXPOSE 3005

CMD ["npm", "start"]