const Router = require('koa-router');
const router = new Router();
const api = new Router();

const users = require('./users-router');
const offices = require('./offices-router');
const publishers = require('./publishers-router');

api.use(users);
api.use(offices);
api.use(publishers);

router.use('/api', api.routes());

module.exports = router;
