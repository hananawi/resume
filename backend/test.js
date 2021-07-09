const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./sqlite3.db', (err) => {
  if (err) {
    console.error(err);
  }
});

db.run('INSERT INTO truck (truck_load, truck_location) VALUES (100, \'aaa\');', (err) => {
  console.log(err);
  console.log(this);
});
