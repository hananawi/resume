const http = require('http');
const querystring = require('querystring');

const router = require('./router.js');

// http.createServer((req, res) => {
//   console.log('request received!');
//   // axios.get('https://www.google.com', {
//   //   proxy: {
//   //     protocol: 'http',
//   //     host: 'localhost',
//   //     port: 4780
//   //   }
//   // }).then(res => {
//   //   console.log(res.status);
//   // }).catch(err => {
//   //   console.log(err);
//   // });
//   res.end();
// }).listen(4000);

http.createServer((req, res) => {
  console.log('request received!');
  const url = new URL(req.url, 'http://localhost:4000');

  if (req.method === 'GET') {
    router.get(url.pathname, url.searchParams, req, res);
  } else if (req.method === 'POST') {
    let postData = '';
    req.addListener('data', function (chunk) {
      postData += chunk;
    });
    req.addListener('end', function () {
      postData = JSON.parse(postData);
      // postData = querystring.parse(postData);
      router.post(url.pathname, postData, req, res);
    });
  }

  // if (url.pathname === '/database/api') {
  //   const id = url.searchParams.get('id');
  //   db.get('select * from goods where goods_id = $id', { $id: id }, (err, row) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //     console.log(row);
  //     console.log(JSON.stringify(row));
  //     res.setHeader('content-type', 'application/json');
  //     res.write(JSON.stringify(row));
  //     res.end();
  //     console.log('request ended!');
  //   });
  // }
}).listen(4000);
console.log('server started');
