###################################
#
# This docker image contains node9
#
# As part of the build process
#
#

FROM node:9

RUN node --version
run npm --version

ENV CTYPTO_PATH=/usr

ENV DBHOST=mysqldb



COPY crypto-config  /usr/


# Create app directory
WORKDIR /usr/src/app



# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source



EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]
