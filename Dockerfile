FROM docker.io/emscripten/emsdk:3.1.60 as build
WORKDIR /code

COPY . .
RUN apt update && apt install autoconf automake -y && npm i -g pnpm

RUN pnpm i && pnpm native:configure && pnpm native:build && pnpm build

FROM docker.io/nginx:alpine
WORKDIR /root
COPY ./deploy/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /code/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
