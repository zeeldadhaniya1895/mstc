
'use client';

import { Button } from '@/components/ui/button';
import { removeAward } from '@/app/actions/awards';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function RemoveAwardButton({ awardId, eventId }: { awardId: string, eventId: string }) {
    const handleRemove = async () => {
        if (!confirm("Remove this award?")) return;
        const res = await removeAward(awardId, eventId);
        if (res.success) toast.success("Removed");
        else toast.error("Failed");
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleRemove} className="text-red-500 hover:bg-red-500/10">
            <Trash2 className="size-4" />
        </Button>
    )
}
