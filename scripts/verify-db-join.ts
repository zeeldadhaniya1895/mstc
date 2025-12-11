
import 'dotenv/config';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Testing DB Join...');

    try {
        // Run the exact query structure behaving badly
        // We use sql`` raw to bypass drizzle schema definitions to test the DB itself
        const result = await db.execute(sql`
            select 
                "session"."sessionToken", 
                "session"."userId", 
                "session"."expires", 
                "user"."id", 
                "user"."name", 
                "user"."email", 
                "user"."emailVerified", 
                "user"."image" 
            from "session" 
            inner join "user" on "user"."id" = "session"."userId" 
            limit 1
        `);
        console.log('Query success!', result);
    } catch (e: any) {
        console.error('Query FAILED!');
        console.error('Message:', e.message);
        console.error('Code:', e.code);
        console.error('Detail:', e.detail || e);
    }

    process.exit(0);
}

main();
