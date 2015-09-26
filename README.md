Front End Boilerplate optimized for simplicity + fast development

opinionated CSS structure ( http://www.sitepoint.com/architecture-sass-project/  )

webpack + npm


#### Development

Start the server

\> npm run start

Starts Express server @ port 3000 via nodemon
Starts webpack-dev-server @ port 8080 with hot-reloading enabled
Express server proxies static asset requests @ /build/*  to webpack-dev-server


#### Production

Build minified assets, saved @ /public/build

\> npm run build:production

Start the server in production mode

\> npm run start:production


