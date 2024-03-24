const sqlite3 = require('sqlite3').verbose();

const { DB } = require('../config/config');
const logger = require('../utils/logger');

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database(
  DB,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      logger.error('Error when opening database connection', err);
    } else {
      logger.info('Connection with SQLite database successfully established');
    }
  }
);

db.get('PRAGMA foreign_keys = ON');

module.exports = db;
