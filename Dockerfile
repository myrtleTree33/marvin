FROM node:8.12.0-jessie

ENV PATH="=/home/node/.npm-global/bin:${PATH}"
ENV NUM_NODES=10
ENV MONGO_URI="mongodb://localhost/test"

# Create app directory
WORKDIR /home/node/app
ADD . /home/node/app
RUN npm install . --unsafe-perm
CMD [ \
    "npm", "start", "--", \
    "-n", "${NUM_NODES}" \
    "-U", "${MONGO)URI}" \
    ]