
const { Pool } = require('pg');
require('dotenv').config();

const testCredentials = [
  { user: 'postgres', password: '', db: 'postgres' },
  { user: 'postgres', password: 'password', db: 'postgres' },
  { user: 'postgres', password: 'postgres', db: 'postgres' },
  { user: 'user', password: 'password', db: 'farming_db' }
];

async function runTests() {
  for (const cred of testCredentials) {
    console.log(`Testing: ${cred.user}:${cred.password || '(none)'}@localhost:5432/${cred.db}`);
    const pool = new Pool({
      user: cred.user,
      password: cred.password,
      host: 'localhost',
      port: 5432,
      database: cred.db,
    });

    try {
      const client = await pool.connect();
      console.log(`✅ Success with ${cred.user}!`);
      const res = await client.query('SELECT NOW()');
      console.log('Time:', res.rows[0].now);
      client.release();
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
      await pool.end();
    }
  }
  console.log('All attempts failed.');
  process.exit(1);
}

runTests();
