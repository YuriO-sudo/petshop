const db = require('./db');

const beginTransaction = () => {
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
};

const rollback = () => {
  return new Promise((resolve, reject) => {
    db.run('ROLLBACK', (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
};

const commit = () => {
  return new Promise((resolve, reject) => {
    db.run('COMMIT', (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
};

module.exports = { beginTransaction, rollback, commit };
