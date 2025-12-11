
import 'dotenv/config';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Creating event_awards table...');

    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "event_awards" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "event_id" uuid NOT NULL REFERENCES "events"("id"),
            "team_id" uuid REFERENCES "teams"("id"),
            "user_id" uuid REFERENCES "user"("id"),
            "title" text NOT NULL,
            "rank" integer NOT NULL,
            "description" text,
            "created_at" timestamp DEFAULT now()
        );
    `);

    console.log('Done!');
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
