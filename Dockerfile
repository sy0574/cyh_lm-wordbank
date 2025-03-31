# FROM registry.cn-hangzhou.aliyuncs.com/basecopy/bitnami-nginx:latest
# COPY dist/  /app/

# FROM nginx
FROM registry.cn-hangzhou.aliyuncs.com/basecopy/nginx:latest
COPY dist/  /home/web

COPY nginx.conf /etc/nginx/nginx.conf

${dockerEnd}
