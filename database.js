const { Pool } = require('pg');

const pool = new Pool({
  user: 'sina',
  host: 'dpg-d1rvpvi4d50c73abp4p0-a',
  database: 'general_akht',
  password: 'B0SPERQ2hSQUHolu01N379bbC3OutMIB',
  port: 5432,
  ssl: true,
});

module.exports = pool;
