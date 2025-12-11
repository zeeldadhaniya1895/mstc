
import 'dotenv/config';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address: npx tsx scripts/promote-admin.ts <email>');
        process.exit(1);
    }

    console.log(`Promoting ${email} to Convener...`);

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error('User not found! Please login via the website first to create your account.');
        process.exit(1);
    }

    await db.update(users)
        .set({ role: 'convener' })
        .where(eq(users.email, email));

    console.log('Success! User is now a Convener.');
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
