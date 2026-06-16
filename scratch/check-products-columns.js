const { Client } = require('pg');

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'sa-east-1',
  'ca-central-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-south-1',
  'ap-northeast-1',
  'ap-northeast-2'
];

async function run() {
  let client = null;
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    client = new Client({
      connectionString: `postgresql://postgres.adjbqktjsjhjnjucimwt:6YdYBm1p3ICLpAi5@${host}:5432/postgres`,
      connectionTimeoutMillis: 5000,
    });
    try {
      await client.connect();
      console.log(`Connected to PostgreSQL via ${region}`);
      break;
    } catch (err) {
      client = null;
    }
  }

  if (!client) {
    console.error('Could not connect to any database region.');
    process.exit(1);
  }

  const res = await client.query(`
    SELECT column_name, data_type, udt_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products';
  `);
  console.log('Columns in products table:', res.rows);
  await client.end();
}

run().catch(console.error);
