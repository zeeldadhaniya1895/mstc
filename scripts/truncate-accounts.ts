
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
    try {
        console.log('Truncating accounts table...');
        // We use raw SQL execution on the client to be sure
        await client`TRUNCATE TABLE account CASCADE`;
        console.log('Account table truncated successfully.');
    } catch (err) {
        console.error('Error truncating table:', err);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
}

main();
