
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { desc, ilike, or } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRoleManager } from '@/components/admin/user-role-manager';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const session = await auth();
    // Strict DB check for security page access
    const currentUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session?.user?.id || ''),
    });

    if (currentUser?.role !== 'convener' && currentUser?.role !== 'deputy_convener') {
        // Only Conveners/Deputies can even see this page
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-400">You do not have permission to view this page.</p>
            </div>
        );
    }

    const { q } = await searchParams;
    const query = q || '';

    const allUsers = await db.query.users.findMany({
        where: query
            ? or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`))
            : undefined,
        orderBy: [desc(users.role), desc(users.createdAt)],
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Governance</h1>
                    <p className="text-gray-400">Manage roles, permissions, and platform access.</p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                        Total Users: {allUsers.length}
                    </Badge>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                    <form className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 size-4 text-gray-500" />
                            <Input
                                name="q"
                                placeholder="Search users by name or email..."
                                className="pl-9 bg-black/20 border-white/10"
                                defaultValue={query}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-2">
                {allUsers.map((user) => (
                    <Card key={user.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="size-10">
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white">{user.name}</h3>
                                        {user.id === currentUser.id && <Badge variant="secondary" className="text-[10px]">YOU</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={`capitalize ${user.role === 'convener' ? 'text-orange-500 border-orange-500/30' :
                                        user.role === 'deputy_convener' ? 'text-cyan-500 border-cyan-500/30' :
                                            user.role === 'core_member' ? 'text-purple-500 border-purple-500/30' :
                                                'text-gray-500 border-gray-500/30'
                                    }`}>
                                    {user.role?.replace('_', ' ')}
                                </Badge>

                                <UserRoleManager
                                    userId={user.id}
                                    currentRole={user.role || 'student'}
                                    userName={user.name || 'User'}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
