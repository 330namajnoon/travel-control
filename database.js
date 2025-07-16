const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://sina:B0SPERQ2hSQUHolu01N379bbC3OutMIB@dpg-d1rvpvi4d50c73abp4p0-a.oregon-postgres.render.com/general_akht',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
