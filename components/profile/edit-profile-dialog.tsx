'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateUserProfile } from '@/app/actions/user-actions';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

interface EditProfileDialogProps {
    user: {
        image?: string | null;
        bio?: string | null;
        githubId?: string | null;
        linkedinId?: string | null;
    };
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = {
            image: formData.get('image') as string,
            bio: formData.get('bio') as string,
            githubId: formData.get('githubId') as string,
            linkedinId: formData.get('linkedinId') as string,
        };

        const res = await updateUserProfile(data);
        setLoading(false);

        if (res.success) {
            toast.success(res.message);
            setOpen(false);
        } else {
            toast.error(res.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-cyan-500/50 transition-all shadow-lg backdrop-blur-sm">
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit Profile</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Profile Picture URL</Label>
                        <Input
                            name="image"
                            defaultValue={user.image || ''}
                            placeholder="https://..."
                            className="bg-black/20"
                        />
                        <p className="text-xs text-gray-500">Paste a direct link to your photo (e.g. from GitHub or LinkedIn).</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                            name="bio"
                            defaultValue={user.bio || ''}
                            placeholder="Tell us about yourself..."
                            className="bg-black/20 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>GitHub URL / ID</Label>
                            <Input
                                name="githubId"
                                defaultValue={user.githubId || ''}
                                placeholder="username"
                                className="bg-black/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn URL / ID</Label>
                            <Input
                                name="linkedinId"
                                defaultValue={user.linkedinId || ''}
                                placeholder="profile-id"
                                className="bg-black/20"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
