FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

## Install Marvin as a global package
RUN npm install -g .
# If you are building your code for production
# RUN npm install --only=production

# EXPOSE 8080
CMD [ "marvin", "-n 10" ]