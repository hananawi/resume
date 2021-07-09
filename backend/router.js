const controller = require('./controller.js');

const getController = {
  '/database/api/getRecords': controller.getRecords,
  '/database/api/getDetail': controller.getDetail
}

const postController = {
  '/database/login': controller.login,
  '/database/register': controller.register,
  '/database/api/sendGoods': controller.sendGoods
}

const router = {
  get(url, searchParams, req, res, cb=new Function()) {
    if(!Object.keys(getController).includes(url)) {
      console.log(`get url: '${url}' not found:()`);
      res.end();
      return;
    }
    console.log('get to:', url);
    getController[url](searchParams, res);
    cb();
  },

  post(url, postData, req, res, cb = new Function()) {
    if (!Object.keys(postController).includes(url)) {
      console.log(`post url: '${url}' not found:(`);
      res.end();
      return;
    }
    console.log('post to:', url);
    postController[url](postData, res, req);
    cb();
  }
}

module.exports = router;
