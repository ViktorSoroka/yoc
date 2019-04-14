const Koa = require('koa');

const initMiddlewares = require('./middlewares');
const routes = require('./routes');

const app = new Koa();
const { PORT = 3000 } = process.env;

initMiddlewares(app);

app
  .use(routes.routes())
  .listen(PORT, async () => {
    console.log(`App is now running on: http://localhost:${PORT}/`);
  });
