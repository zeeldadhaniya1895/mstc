'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, FileText, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RegistrationDetailsDialog({ registration }: { registration: any }) {
    if (!registration) return null;

    const customAnswers = registration.reg.customAnswers as Record<string, string> | null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20">
                    <Eye className="size-4" />
                    <span className="sr-only">View Details</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <User className="size-5 text-cyan-400" />
                        {registration.user?.name || 'Unknown User'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Registration Details & Form Responses
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* User & Team Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
                            <h4 className="text-xs uppercase text-gray-500 font-semibold mb-2">Participant</h4>
                            <div className="text-sm font-medium">{registration.user?.name}</div>
                            <div className="text-xs text-gray-400">{registration.user?.email}</div>
                            <div className="mt-2">
                                <Badge variant="outline" className="capitalize text-xs text-gray-400 border-gray-700">
                                    {registration.user?.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
                            <h4 className="text-xs uppercase text-gray-500 font-semibold mb-2">Team Status</h4>
                            {registration.team ? (
                                <>
                                    <div className="flex items-center gap-2 text-cyan-400 font-medium">
                                        <Users className="size-4" />
                                        {registration.team.name}
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono bg-black/30 px-2 py-1 rounded w-fit mt-1">
                                        CODE: {registration.team.joinCode}
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-gray-500 italic">No Team (Solo)</div>
                            )}
                        </div>
                    </div>

                    {/* Custom Answers Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                            <FileText className="size-4 text-purple-400" />
                            <h3 className="font-semibold">Form Responses</h3>
                        </div>

                        <ScrollArea className="h-[200px] w-full rounded-md border border-white/10 bg-white/5 p-4">
                            {customAnswers && Object.keys(customAnswers).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(customAnswers).map(([question, answer]) => (
                                        <div key={question} className="space-y-1">
                                            <p className="text-xs text-gray-400 font-medium uppercase">{question}</p>
                                            <p className="text-sm text-gray-200 whitespace-pre-wrap">{String(answer)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 italic text-sm">
                                    <FileText className="size-8 opacity-20 mb-2" />
                                    No custom questions answered.
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
