const fsp = require('fs/promises');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sqlite3.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

fsp.open('./数据库课设/建表语句408.txt')
  .then((res) => {
    return res.readFile({ encoding: 'utf-8' });
  }).then(data => {
    return data;
  }).then(sql => {
    db.exec(sql);
    db.run(`insert into warehouse (warehouse_name, warehouse_address) values
      ('warehouse A', 'First Road'),
      ('warehouse B', 'Second Road'),
      ('warehouse C', 'Third Road')`, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('database init successfully!');
    });
  }).finally(() => {
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  });
