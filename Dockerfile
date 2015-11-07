FROM node:onbuild

ENV PORT 80

RUN ./node_modules/.bin/gulp

EXPOSE 80

CMD ./node_modules/.bin/pm2 start dist/app.js --name Umer-Jumper --no-daemon