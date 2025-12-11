
'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormBuilder, FormField } from '@/components/admin/form-builder';
import { createEvent } from '@/app/actions/events';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Event'}</Button>
}

const initialState = {
    message: '',
};

export default function CreateEventPage() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [maxTeamSize, setMaxTeamSize] = useState(4);
    const [state, formAction] = useActionState(createEvent, initialState);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Create New Event</h1>

            <form action={formAction} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Event Title</label>
                        <Input name="title" required placeholder="Winter of Code 2025" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL Slug</label>
                        <Input name="slug" required placeholder="woc-2025" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Event Type</label>
                        <Select name="type" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hackathon">Hackathon</SelectItem>
                                <SelectItem value="mentorship">Mentorship (WoC/SoC)</SelectItem>
                                <SelectItem value="cp_solo">CP (Solo)</SelectItem>
                                <SelectItem value="cp_team">CP (Team)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Max Team Size</label>
                        <Input
                            type="number"
                            min={1}
                            max={10}
                            value={isNaN(maxTeamSize) ? '' : maxTeamSize}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setMaxTeamSize(isNaN(val) ? 0 : val);
                            }}
                            placeholder="4"
                        />
                        <p className="text-xs text-gray-400">Set to 1 for individual events.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date & Time</label>
                        <Input type="datetime-local" name="startDate" className="bg-white/5" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date & Time</label>
                        <Input type="datetime-local" name="endDate" className="bg-white/5" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Poster Image URL (Optional)</label>
                        <Input type="url" name="posterUrl" placeholder="https://..." className="bg-white/5" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Registration Form</h3>
                    <p className="text-sm text-gray-400">Define what data you need from participants.</p>
                    <FormBuilder value={fields} onChange={setFields} />
                    <input type="hidden" name="config" value={JSON.stringify({ registrationFields: fields, maxTeamSize })} />
                </div>

                {state?.message && (
                    <div className="text-red-500 text-sm">{state.message}</div>
                )}

                <div className="flex justify-end gap-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
