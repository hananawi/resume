const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sqlite3.db', (err) => {
  if (err) {
    console.error(err);
  }
});
db.run('PRAGMA foreign_keys=ON;');

exports.login = function (postData, res) {
  console.log('postData:', postData);
  let sql = `
select * from sender
where sender_name='${postData.username}' and sender_password='${postData.password}';`;
  db.get(sql, (err, row) => {
    if (err) {
      console.log(err);
      res.statusCode = 404;
      res.statusMessage = 'sql excu failed:(';
    } else if (!row) {
      res.statusCode = 404;
      res.statusMessage = 'User Not Found:(';
    } else {
      // 301 重定向
      // res.writeHead(301, 'writeHeadMessage', {
      //   'Location': '/project'
      // });
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Set-Cookie', [
        `senderID=${row.sender_id}; Path=/`,
        `senderName=${row.sender_name}; Path=/`
      ]);
      res.write(JSON.stringify(row));
    }
    res.end();
  });
}

exports.register = function (postData, res) {
  console.log(postData);

  new Promise((resolve, reject) => {
    db.get(`select * from sender
    where sender_name='${postData.username}' and
    sender_password='${postData.password}';`, (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        reject('user exists:(');
      } else {
        resolve(`insert into sender
        (sender_name, sender_password, sender_sex, sender_phone, sender_address)
        values ('${postData.username}', '${postData.password}', 'male', '01234567890', 'SCAU');`);
      }
    });
  }).then(sql => {
    return new Promise((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) {
          reject('sql excu failed:(');
        } else {
          resolve();
        }
      });
    });
  }).catch(err => {
    res.statusCode = 404;
    res.statusMessage = err;
  }).finally(() => {
    res.end();
  });
}

exports.sendGoods = function (postData, res, req) {
  console.log(postData);
  let receiverID = 0;
  let goodsID = 0;

  const cookie = {};
  req.headers['cookie']?.split('; ').forEach(val => {
    val = val.split('=');
    cookie[val[0]] = val[1];
  });
  let senderID = cookie['senderID'];

  (async function () {
    const row = await myDBGet(`select * from receiver where receiver_name='${postData.receiverName}'`);
    if (!row) {
      receiverID = (await myDBRun(`insert into receiver (receiver_name, receiver_sex, receiver_phone, receiver_address)
        values ('${postData.receiverName}', 'male', '01234567890', 'SCAU')`)).lastID;
    } else {
      receiverID = row.receiver_id;
    }

    goodsID = (await myDBRun(`insert into goods (goods_name, goods_type, goods_weight)
      values ('${postData.goodsName}', '${postData.goodsType}', ${postData.goodsWeight})`)).lastID;

    await myDBRun(`insert into express (sender_id, receiver_id, goods_id, express_price,
      express_type, express_createtime, express_pretime)
      values (${senderID}, ${receiverID}, ${goodsID},
      '${postData.expressType === 'fast' ? 10 : 5}', '${postData.expressType}',
      ${Date.now()}, ${Math.ceil(Math.random() * 3)})`);

    const transportWay = Math.floor(Math.random() * 2) === 0 ? 'truck' : 'plane';
    const time = Date.now();

    async function genPromise(goodsID, sendAdress, receiveAdress, sendTime, receiveTime) {
      console.log(sendTime);
      await myDBRun(`insert into transport (goods_id, staff_id, truck_id, plane_id, send_address,
        send_time, receive_address, arrive_time)
        values (${goodsID}, ${Math.ceil(Math.random() * 10)},
        ${transportWay === "'truck'" ? Math.ceil(Math.random() * 10) : 'null'},
        ${transportWay === "'plane'" ? Math.ceil(Math.random() * 10) : 'null'},
        '${sendAdress}', ${sendTime}, '${receiveAdress}', ${receiveTime})`);
    }
    await genPromise(goodsID, '仓库A', '仓库B', time, time + 24 * 3600000);
    await genPromise(goodsID, '仓库B', '仓库C', time + 24 * 3600000, time + 2 * 24 * 3600000);
    await genPromise(goodsID, '仓库C', '仓库D', time + 2 * 24 * 3600000, time + 3 * 24 * 3600000);

    console.log('sendGoods excu successfully!');

  })().catch(err => {
    console.log(err);
    res.statusCode = 404;
    res.statusMessage = err;
  }).finally(() => {
    res.end();
  });
}

exports.getRecords = function (searchParams, res) {
  const records = [];
  (async function () {
    const rawRecords = await new Promise((resolve, reject) => {
      db.all(`select * from express where sender_id=${searchParams.get('senderID')}`, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
    for (let rawRecord of rawRecords) {
      const goodsName = await myDBGet(`select * from goods
        where goods_id=${rawRecord.goods_id}`, 'goods_name');

      const receiverName = await myDBGet(`select * from receiver
        where receiver_id=${rawRecord.receiver_id}`, 'receiver_name');

      const arriveTime = rawRecord.express_arrivetime;
      const receiverID = rawRecord.receiver_id;
      const expressID = rawRecord.express_id;
      records.push({
        expressID,
        goodsName,
        receiverName,
        arriveTime,
        receiverID
      });
    }

    res.setHeader('Content-Type', 'text/json');
    res.write(JSON.stringify(records));
  })().catch(err => {
    console.log(err);
    res.statusCode = 404;
    res.statusMessage = err;
  }).finally(() => {
    res.end();
  });
}

exports.getDetail = function (searchParams, res) {
  (async function () {
    const rows = await myDBAll(`select send_time, send_address, receive_address
      from express natural join transport where express_id=${searchParams.get('expressID')}`);

    const expressInfo = await myDBGet(`select *
      from express natural join sender natural join receiver natural join goods
      where express_id=${searchParams.get('expressID')}`);

    const {
      sender_name: senderName,
      receiver_name: receiverName,
      goods_name: goodsName,
      express_type: expressType,
      express_price: expressPrice,
    } = expressInfo;

    const results = {
      senderName,
      receiverName,
      goodsName,
      expressType,
      expressPrice,
      transports: rows.map(val => {
        const obj = new Date(Number(val.send_time));
        return {
          hour: obj.getHours(),
          minute: obj.getMinutes(),
          date: obj.getDate(),
          month: obj.getMonth(),
          sendAddress: val.send_address,
          receiveAddress: val.receive_address
        }
      })
    }
    res.setHeader('Content-Type', 'text/json');
    res.write(JSON.stringify(results));

  })().catch(err => {
    console.error(err);
    res.statusCode = 404;
    res.statusMessage = err;
  }).finally(() => {
    res.end();
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////
function myDBGet(sql, results) {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        console.log(sql);
        reject(err);
        return;
      }
      if (!results) {
        resolve(row);
      } else if (results instanceof Array) {
        resolve(results.map((key) => row[key]));
      } else {
        resolve(row[results]);
      }
    });
  });
}

function myDBAll(sql, results) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        console.log(sql);
        reject(err);
        return;
      }
      if (!results) {
        resolve(rows);
      } else if (results instanceof Array) {
        resolve(rows.map(row => results.map(key => row[key])));
      } else {
        resolve(rows.map(row => row[results]));
      }
    });
  });
}

function myDBRun(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) {
        console.log(sql);
        reject(err);
        return;
      }
      resolve(this);
    });
  });
}
