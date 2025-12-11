
'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { updateUserRole, removeUser } from '@/app/actions/users';
import { useState } from 'react';
import { Loader2, MoreHorizontal, ShieldAlert, ShieldCheck, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UserRoleManager({ userId, currentRole, userName }: { userId: string, currentRole: string, userName: string }) {
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleRoleChange = async (newRole: 'student' | 'member' | 'core_member' | 'deputy_convener' | 'convener') => {
        if (newRole === 'convener') {
            const confirm = window.confirm(`Are you SURE you want to promote ${userName} to Convener? They will have FULL control.`);
            if (!confirm) return;
        }

        setLoading(true);
        const res = await updateUserRole(userId, newRole);
        setLoading(false);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        const res = await removeUser(userId);
        setLoading(false);
        setOpenDelete(false);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loading}>
                        {loading ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4 text-gray-400" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Manage {userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal">Promote / Demote</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleRoleChange('student')} disabled={currentRole === 'student'}>
                        Student
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('member')} disabled={currentRole === 'member'}>
                        Member
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('core_member')} disabled={currentRole === 'core_member'}>
                        <UserCog className="size-3 mr-2 text-purple-400" /> Core Team
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange('deputy_convener')} disabled={currentRole === 'deputy_convener'}>
                        <ShieldCheck className="size-3 mr-2 text-cyan-400" /> Deputy Convener
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRoleChange('convener')} className="text-orange-500 focus:text-orange-500">
                        <ShieldAlert className="size-3 mr-2" /> Make Convener
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                        onSelect={(e) => {
                            e.preventDefault();
                            setOpenDelete(true);
                        }}
                    >
                        <Trash2 className="size-3 mr-2" /> Remove User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove {userName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account and user data from the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Remove User</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
