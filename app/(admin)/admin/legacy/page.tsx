import { LegacyBoard } from "@/components/admin/legacy-board";
import { getLegacyNotes, getTenureOptions } from "@/app/actions/legacy-actions";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function LegacyPage() {
    const session = await auth();
    const { data: notes } = await getLegacyNotes();
    const tenureOptions = await getTenureOptions();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <LegacyBoard
                notes={notes || []}
                tenureOptions={tenureOptions}
                currentUserId={session?.user?.id}
            />
        </div>
    );
}
