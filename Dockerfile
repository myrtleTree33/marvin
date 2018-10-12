FROM node:8.12.0-jessie

ENV PATH="=/home/node/.npm-global/bin:${PATH}"

# Create app directory
WORKDIR /home/node/app
ADD . /home/node/app
RUN npm install . --unsafe-perm
CMD [ "npm", "start" ]