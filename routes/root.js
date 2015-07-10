import Router from 'koa-router';

let router = Router();
router.get('/', get);

function * get (next) {
  this.response.status = 200;
  yield next;
}

export default router.middleware();
