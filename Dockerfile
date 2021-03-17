FROM docker-dev.artifactory.tmna-devops.com/selenium/node-chrome:84.0.4147.105-20200730

WORKDIR /usr/local/
USER root
RUN apt-get update -y && \
    apt-get upgrade -y

RUN apt-get install -y software-properties-common && \
    apt-get install -y git && \
    wget https://deb.nodesource.com/setup_12.x && \
    chmod +x ./setup_12.x && \
    ./setup_12.x && \ 
    apt-get install -y nodejs && \
    npm --version && \
    node --version
    
COPY / /usr/local/

RUN npm i
RUN npm run test:dev-linux
