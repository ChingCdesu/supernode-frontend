FROM node:lts-alpine as build
WORKDIR /code

COPY . .
RUN npm i -g pnpm

RUN pnpm i
RUN pnpm build

FROM nginx:alpine
WORKDIR /root
RUN apk update --no-cache
RUN apk add bash
COPY --from=build /code/dist /usr/share/nginx/html
COPY --from=build /code/deploy/nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
