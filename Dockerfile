FROM node:18.16.0-alpine3.17 AS production

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN apk add --update --no-cache \
  tini

ENTRYPOINT ["/sbin/tini", "--"]

RUN mkdir -p /usr/local/src/project/protobufjs-nestjs-protoloader
COPY . /usr/local/src/project/protobufjs-nestjs-protoloader
WORKDIR /usr/local/src/project/protobufjs-nestjs-protoloader

# NOTE:  We add domain to known_hosts in order to pull private git repositories in `yarn install` command
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

RUN --mount=type=ssh yarn install

CMD ["yarn", "run", "compile"]

# --------------------------------------------- #

FROM production AS development

CMD ["yarn", "run", "compile:dev"]
