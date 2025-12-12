'use server';

import { db } from "@/lib/db";
import { legacyNotes } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";

// Calculate Tenure Options
export const getTenureOptions = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11. June is 5.

    // Academic tenure usually starts around June/July
    const currentStartYear = month >= 5 ? year : year - 1;

    return [
        `${currentStartYear}-${currentStartYear + 1}`, // Current
        `${currentStartYear - 1}-${currentStartYear}`  // Previous
    ];
};

export async function saveLegacyNote(content: string, tenure: string) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.role) {
        return { error: "Unauthorized" };
    }

    try {
        // Check if note exists
        const existingNote = await db.query.legacyNotes.findFirst({
            where: and(
                eq(legacyNotes.userId, session.user.id),
                eq(legacyNotes.tenure, tenure)
            )
        });

        if (existingNote) {
            // Update
            await db.update(legacyNotes)
                .set({ content, role: session.user.role as any }) // Update role in case it changed
                .where(eq(legacyNotes.id, existingNote.id));
        } else {
            // Insert
            await db.insert(legacyNotes).values({
                userId: session.user.id,
                content,
                role: session.user.role as "convener" | "deputy_convener" | "core_member" | "member" | "student",
                tenure,
            });
        }

        revalidatePath('/admin/legacy');
        return { success: true };
    } catch (error) {
        console.error("Failed to save note:", error);
        return { error: "Failed to save note" };
    }
}

export async function deleteLegacyNote(noteId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Verify ownership
        const note = await db.query.legacyNotes.findFirst({
            where: eq(legacyNotes.id, noteId)
        });

        if (!note || note.userId !== session.user.id) {
            return { error: "Unauthorized deletion" };
        }

        await db.delete(legacyNotes).where(eq(legacyNotes.id, noteId));
        revalidatePath('/admin/legacy');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete note" };
    }
}

export async function getLegacyNotes() {
    try {
        const notes = await db.query.legacyNotes.findMany({
            with: {
                user: {
                    columns: {
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: [desc(legacyNotes.createdAt)]
        });
        return { success: true, data: notes };
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        return { error: "Failed to fetch notes", data: [] };
    }
}
