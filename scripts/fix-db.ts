
import 'dotenv/config';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Migrating database manually...');

    // 1. Create the 'user' table if it doesn't exist
    await db.execute(sql`
        CREATE TYPE "role" AS ENUM ('student', 'member', 'core_member', 'deputy_convener', 'convener');
    `).catch(e => console.log('Enum type type "role" might already exist, skipping...'));

    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "user" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "email" text NOT NULL UNIQUE,
            "name" text,
            "emailVerified" timestamp,
            "image" text,
            "role" "role" DEFAULT 'student',
            "college_id" text,
            "xp_points" integer DEFAULT 0,
            "created_at" timestamp DEFAULT now()
        );
    `);

    // 2. Migrate existing data if needed (optional, assuming dev env)
    // await db.execute(sql`INSERT INTO "user" SELECT * FROM "users"`);

    console.log('Migration complete!');
    process.exit(0);
}

main().catch(console.error);
