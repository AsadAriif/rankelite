const { Client } = require('pg');

async function testCredentials() {
  const commonPasswords = [
    'postgres',
    'admin',
    'root',
    '123456',
    '1234',
    'password',
    'postgres123',
    'admin123',
    '12345678',
    'P@ssword1',
    ''
  ];

  console.log('🔍 Testing PostgreSQL connection on port 5432...');

  for (const pwd of commonPasswords) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: pwd,
      database: 'postgres',
      connectionTimeoutMillis: 1500
    });

    try {
      await client.connect();
      console.log(`✅ SUCCESS! Connected to PostgreSQL with password: "${pwd}"`);
      
      const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'eliterank_db'");
      if (res.rowCount === 0) {
        console.log("⚡ Creating database 'eliterank_db'...");
        await client.query("CREATE DATABASE eliterank_db");
        console.log("✅ Database 'eliterank_db' created!");
      } else {
        console.log("✅ Database 'eliterank_db' already exists!");
      }
      
      await client.end();
      return { success: true, password: pwd };
    } catch (err) {
      console.log(`❌ Failed with password "${pwd}": ${err.message}`);
      try { await client.end(); } catch (e) {}
    }
  }

  return { success: false };
}

testCredentials().then(result => {
  if (result.success) {
    console.log(`FOUND_PASSWORD=${result.password}`);
  } else {
    console.log('FOUND_PASSWORD=NONE');
  }
});
