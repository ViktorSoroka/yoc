const { readdirSync } = require('fs');
const { join } = require('path');

const initMiddlewares = app => {
  const middlewares = readdirSync(__dirname).sort();

  middlewares.forEach(middleware => {
    const middlewarePath = join(__dirname, middleware);

    if (middlewarePath !== __filename) {
      require(middlewarePath)(app);
    }
  });
};

module.exports = initMiddlewares;
