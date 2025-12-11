'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assignDomain } from '@/app/actions/registrations';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface DomainAssignerProps {
    registrationId: string;
    currentDomain?: string | null;
    availableDomains: string[];
    priorities?: string[] | null;
}

export function DomainAssigner({ registrationId, currentDomain, availableDomains, priorities }: DomainAssignerProps) {
    const [loading, setLoading] = useState(false);

    const handleAssign = async (domain: string) => {
        setLoading(true);
        const res = await assignDomain(registrationId, domain);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priorities</label>
                <div className="flex flex-wrap gap-2">
                    {priorities && priorities.length > 0 ? (
                        priorities.map((p, idx) => (
                            <Badge key={idx} variant="outline" className="border-cyan-500/20 text-cyan-400 bg-cyan-500/5">
                                <span className="mr-1 text-gray-500">{idx + 1}.</span> {p}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-gray-500 italic">No priorities selected</span>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Domain</label>
                <Select disabled={loading} value={currentDomain || ''} onValueChange={handleAssign}>
                    <SelectTrigger className="w-full h-8 text-sm bg-black/20 border-white/10">
                        <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableDomains.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
