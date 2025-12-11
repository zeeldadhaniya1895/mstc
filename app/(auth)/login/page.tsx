
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github, Chrome, Terminal } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    return (
        <Card className="w-full max-w-md p-8 glass-panel border-white/10 relative z-10">
            <div className="flex flex-col items-center mb-8">
                <div className="size-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                    <Terminal className="text-white size-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                <p className="text-gray-400 text-sm mt-2">Sign in to access your dashboard</p>
            </div>

            <div className="space-y-4">
                <Button
                    className="w-full bg-white text-black hover:bg-gray-200"
                    onClick={() => signIn('github', { callbackUrl })}
                >
                    <Github className="mr-2 size-4" /> Continue with GitHub
                </Button>
                <Button
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10"
                    onClick={() => signIn('google', { callbackUrl })}
                >
                    <Chrome className="mr-2 size-4 text-red-400" /> Continue with Google
                </Button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Join Club
                </Link>
            </div>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-900/20 blur-3xl pointer-events-none" />

            <Suspense fallback={<div>Loading login...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
