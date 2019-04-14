const Router = require('koa-router');
const ctrl = require('../controllers').users;
const router = new Router();

router.get('/users', ctrl.get);
router.post('/users', ctrl.post);
router.post('/users/:id', ctrl.put);
router.del('/users/:id', ctrl.del);

module.exports = router.routes();
