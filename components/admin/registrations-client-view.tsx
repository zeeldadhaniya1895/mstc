'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DomainAssigner } from '@/components/admin/domain-assigner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { exportRegistrationsToExcel } from '@/lib/data-export';

interface RegistrationsClientViewProps {
    initialRegistrations: any[];
    event: any;
    availableDomains: string[];
}

export function RegistrationsClientView({ initialRegistrations, event, availableDomains }: RegistrationsClientViewProps) {
    const [registrations, setRegistrations] = useState(initialRegistrations);
    const [selectedDomain, setSelectedDomain] = useState<string>('all');

    // Filter Logic
    const filteredRegistrations = selectedDomain === 'all'
        ? registrations
        : registrations.filter(r => r.assignedDomain === selectedDomain);

    const handleExport = () => {
        const fileName = `${event.slug}-registrations-${selectedDomain === 'all' ? 'all' : selectedDomain}-${new Date().toISOString().split('T')[0]}`;
        exportRegistrationsToExcel(filteredRegistrations, fileName);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-400">Filter by Domain:</span>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger className="w-[200px] bg-black/20 border-white/10">
                            <SelectValue placeholder="All Domains" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            {availableDomains.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleExport} className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700">
                    <Download className="size-4" /> Export Excel
                </Button>
            </div>

            <div className="grid gap-6">
                {filteredRegistrations.map((reg) => (
                    <Card key={reg.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white">{reg.user.name}</h3>
                                <p className="text-sm text-gray-400">{reg.user.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="capitalize">{reg.status}</Badge>
                                    {reg.team && (
                                        <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                                            Team: {reg.team.name}
                                        </Badge>
                                    )}
                                    {reg.assignedDomain && (
                                        <Badge className="bg-cyan-500/20 text-cyan-300">
                                            {reg.assignedDomain}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Domain Management Section (Only for Mentorship) */}
                            {event.type === 'mentorship' && (
                                <div className="w-full md:w-64 border-l border-white/10 pl-6">
                                    <DomainAssigner
                                        registrationId={reg.id}
                                        currentDomain={reg.assignedDomain}
                                        availableDomains={availableDomains}
                                        priorities={reg.domainPriorities as string[]}
                                    />
                                </div>
                            )}

                            {/* Additional Answers Preview */}
                            {reg.customAnswers && Object.keys(reg.customAnswers as object).length > 0 && (
                                <div className="w-full md:w-64 border-l border-white/10 pl-6 text-sm text-gray-400">
                                    <div className="font-semibold text-gray-500 mb-1">Details</div>
                                    <pre className="whitespace-pre-wrap font-sans text-xs opacity-70">
                                        {JSON.stringify(reg.customAnswers, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {filteredRegistrations.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No registrations found for the selected filter.
                    </div>
                )}
            </div>
        </div>
    );
}
