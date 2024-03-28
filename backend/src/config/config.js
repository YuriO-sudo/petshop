const PORT = process.env.PORT || 3000;
const DB = process.env.DB || './.db/petshop.db';
const LOG_LEVEL = process.env.LOG_LEVEL || 'http';

module.exports = { PORT, DB, LOG_LEVEL };
