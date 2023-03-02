FROM nginx:alpine
WORKDIR /root
RUN apk update --no-cache
RUN apk add bash
COPY dist /usr/share/nginx/html
COPY deploy/nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
