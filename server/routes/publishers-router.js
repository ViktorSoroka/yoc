const Router = require('koa-router');
const ctrl = require('../controllers').publishers;
const router = new Router();

router.get('/publishers', ctrl.get);

module.exports = router.routes();
