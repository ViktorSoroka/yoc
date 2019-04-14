const Router = require('koa-router');
const ctrl = require('../controllers').offices;
const router = new Router();

router.get('/offices', ctrl.get);

module.exports = router.routes();
