FROM node:8.12.0-jessie

ENV PATH="=/home/node/.npm-global/bin:${PATH}"
ENV NUM_NODES=10
ENV MONGO_URI="mongodb://localhost/test"

# Create app directory
WORKDIR /home/node/app
ADD . /home/node/app
RUN npm install . --unsafe-perm
# Run in bash instead of sh
ENTRYPOINT [ "/bin/bash", "-c", "npm start -- -n ${NUM_NODES} -u ${MONGO_URI}" ]