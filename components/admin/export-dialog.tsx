"use client"

import { useState } from "react"
import { Download, Settings2 } from "lucide-react"
import { ExportOptions } from "@/lib/data-export"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ExportDialogProps {
    onExport: (options: ExportOptions) => void
    allCustomQuestions: string[]
    allWeeks: number[]
}

export function ExportDialog({
    onExport,
    allCustomQuestions,
    allWeeks,
}: ExportDialogProps) {
    const [open, setOpen] = useState(false)
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        participantFields: {
            name: true,
            email: true,
            status: true,
            domain: true,
            date: true,
        },
        teamFields: {
            name: true,
            code: true,
        },
        customQuestions: allCustomQuestions,
        includeDomainPriorities: true,
        checkpointFields: {
            weeks: allWeeks,
            content: true,
            feedback: true,
            approvalStatus: true,
        },
    })

    // Handlers for granular updates
    const toggleCustomQuestion = (question: string, checked: boolean) => {
        setExportOptions((prev) => ({
            ...prev,
            customQuestions: checked
                ? [...prev.customQuestions, question]
                : prev.customQuestions.filter((q) => q !== question),
        }))
    }

    const toggleWeek = (week: number, checked: boolean) => {
        setExportOptions((prev) => ({
            ...prev,
            checkpointFields: {
                ...prev.checkpointFields,
                weeks: checked
                    ? [...prev.checkpointFields.weeks, week]
                    : prev.checkpointFields.weeks.filter((w) => w !== week),
            },
        }))
    }

    const handleExportClick = () => {
        onExport(exportOptions)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700">
                    <Settings2 className="size-4" /> Export Options
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-2xl max-h-[85vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b border-white/10">
                    <DialogTitle>Export Configuration</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6">
                    <div className="space-y-8 py-6">
                        {/* 1. Participant Details */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                                Participant Details
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.keys(exportOptions.participantFields).map((key) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`p-${key}`}
                                            checked={
                                                exportOptions.participantFields[
                                                key as keyof typeof exportOptions.participantFields
                                                ]
                                            }
                                            onCheckedChange={(c) =>
                                                setExportOptions((prev) => ({
                                                    ...prev,
                                                    participantFields: {
                                                        ...prev.participantFields,
                                                        [key]: !!c,
                                                    },
                                                }))
                                            }
                                        />
                                        <Label htmlFor={`p-${key}`} className="capitalize cursor-pointer">
                                            {key}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Team Details */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                                Team Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="t-name"
                                        checked={exportOptions.teamFields.name}
                                        onCheckedChange={(c) =>
                                            setExportOptions((prev) => ({
                                                ...prev,
                                                teamFields: { ...prev.teamFields, name: !!c },
                                            }))
                                        }
                                    />
                                    <Label htmlFor="t-name">Team Name</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="t-code"
                                        checked={exportOptions.teamFields.code}
                                        onCheckedChange={(c) =>
                                            setExportOptions((prev) => ({
                                                ...prev,
                                                teamFields: { ...prev.teamFields, code: !!c },
                                            }))
                                        }
                                    />
                                    <Label htmlFor="t-code">Join Code</Label>
                                </div>
                            </div>
                        </div>

                        {/* 3. Custom Questions */}
                        {allCustomQuestions.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                                    Custom Questions
                                </h4>
                                <div className="space-y-2">
                                    {allCustomQuestions.map((q, idx) => (
                                        <div key={idx} className="flex items-start space-x-2">
                                            <Checkbox
                                                id={`q-${idx}`}
                                                className="mt-1"
                                                checked={exportOptions.customQuestions.includes(q)}
                                                onCheckedChange={(c) => toggleCustomQuestion(q, !!c)}
                                            />
                                            <Label
                                                htmlFor={`q-${idx}`}
                                                className="text-sm leading-tight text-gray-300 cursor-pointer"
                                            >
                                                {q}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Weekly Submissions (Granular) */}
                        {allWeeks.length > 0 && (
                            <div className="space-y-5">
                                <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                                    Submissions & Feedback
                                </h4>

                                {/* Column Selectors */}
                                <div className="space-y-3">
                                    <Label className="text-xs text-gray-500 font-medium">Columns to Include</Label>
                                    <div className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sub-content"
                                                checked={exportOptions.checkpointFields.content}
                                                onCheckedChange={(c) =>
                                                    setExportOptions((prev) => ({
                                                        ...prev,
                                                        checkpointFields: {
                                                            ...prev.checkpointFields,
                                                            content: !!c,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Label htmlFor="sub-content">Content</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sub-feedback"
                                                checked={exportOptions.checkpointFields.feedback}
                                                onCheckedChange={(c) =>
                                                    setExportOptions((prev) => ({
                                                        ...prev,
                                                        checkpointFields: {
                                                            ...prev.checkpointFields,
                                                            feedback: !!c,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Label htmlFor="sub-feedback">Feedback</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sub-status"
                                                checked={exportOptions.checkpointFields.approvalStatus}
                                                onCheckedChange={(c) =>
                                                    setExportOptions((prev) => ({
                                                        ...prev,
                                                        checkpointFields: {
                                                            ...prev.checkpointFields,
                                                            approvalStatus: !!c,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Label htmlFor="sub-status">Status</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Week Selectors */}
                                <div className="space-y-3">
                                    <Label className="text-xs text-gray-500 font-medium">Weeks to Include</Label>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                        {allWeeks.map((week) => (
                                            <div key={week} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`week-${week}`}
                                                    checked={exportOptions.checkpointFields.weeks.includes(week)}
                                                    onCheckedChange={(c) => toggleWeek(week, !!c)}
                                                />
                                                <Label htmlFor={`week-${week}`}>W{week}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other */}
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="dp"
                                    checked={exportOptions.includeDomainPriorities}
                                    onCheckedChange={(c) =>
                                        setExportOptions((prev) => ({
                                            ...prev,
                                            includeDomainPriorities: !!c,
                                        }))
                                    }
                                />
                                <Label htmlFor="dp">Include Domain Priorities</Label>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="px-6 py-4 border-t border-white/10 bg-[#1a1a1a] gap-2 sm:gap-0 mt-auto">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleExportClick} className="bg-green-600 hover:bg-green-700 gap-2">
                        <Download className="size-4" /> Download Excel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
