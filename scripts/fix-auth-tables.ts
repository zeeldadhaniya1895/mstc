
import 'dotenv/config';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Migrating remaining Auth tables manually...');

    // Account Table
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "account" (
            "userId" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
            "type" text NOT NULL,
            "provider" text NOT NULL,
            "providerAccountId" text NOT NULL,
            "refresh_token" text,
            "access_token" text,
            "expires_at" integer,
            "token_type" text,
            "scope" text,
            "id_token" text,
            "session_state" text,
            CONSTRAINT "account_provider_providerAccountId_pk" UNIQUE ("provider", "providerAccountId")
        );
    `);
    console.log('Checked/Created "account" table.');

    // Session Table
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "session" (
            "sessionToken" text PRIMARY KEY,
            "userId" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
            "expires" timestamp NOT NULL
        );
    `);
    console.log('Checked/Created "session" table.');

    // VerificationToken Table
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "verificationToken" (
            "identifier" text NOT NULL,
            "token" text NOT NULL,
            "expires" timestamp NOT NULL,
            CONSTRAINT "verificationToken_identifier_token_pk" UNIQUE ("identifier", "token")
        );
    `);
    console.log('Checked/Created "verificationToken" table.');

    console.log('All Auth tables migration complete!');
    process.exit(0);
}

main().catch(console.error);
