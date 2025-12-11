
import { Navbar } from '@/components/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, Users, Code2, Rocket } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-24">
                {/* Hero Section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 px-4 py-1.5 uppercase tracking-widest text-xs">
                        Since 2023
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                        We Build The Future.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        The Microsoft Student Technical Club (MSTC) is a community of builders, innovators, and dreamers.
                        We don't just write code; we solve real-world problems.
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors">
                        <div className="size-12 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center mb-6">
                            <Terminal className="size-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                        <p className="text-gray-400 leading-relaxed">
                            To empower students with the technical skills and mindset required to thrive in the modern tech industry through hands-on projects and mentorship.
                        </p>
                    </Card>
                    <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors">
                        <div className="size-12 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center mb-6">
                            <Users className="size-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Our Community</h3>
                        <p className="text-gray-400 leading-relaxed">
                            A diverse group of developers, designers, and tech enthusiasts. We believe in peer-to-peer learning and growing together as a family.
                        </p>
                    </Card>
                    <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors">
                        <div className="size-12 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center mb-6">
                            <Rocket className="size-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                        <p className="text-gray-400 leading-relaxed">
                            To become the premier student technical hub where every member graduates with a portfolio of impactful projects and a network of lifelong peers.
                        </p>
                    </Card>
                </div>

                {/* History / Timeline Section (Simplified) */}
                <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-12 pl-8 md:pl-16">
                    <div className="relative">
                        <div className="absolute -left-[37px] md:-left-[69px] top-1 size-4 rounded-full bg-cyan-500 border-4 border-[#0f0f0f]" />
                        <h3 className="text-3xl font-bold mb-4">2025: The Platform Era</h3>
                        <p className="text-gray-400 max-w-2xl">
                            Launching the "Super Techie" platform to gamify learning and streamline event management, marking a new chapter in how we operate.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[37px] md:-left-[69px] top-1 size-4 rounded-full bg-gray-600 border-4 border-[#0f0f0f]" />
                        <h3 className="text-3xl font-bold mb-4">2024: Expansion</h3>
                        <p className="text-gray-400 max-w-2xl">
                            Hosted our first city-wide Hackathon "HackNova", with over 500 participants. Established dedicated domains for AI/ML and Web Development.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[37px] md:-left-[69px] top-1 size-4 rounded-full bg-gray-600 border-4 border-[#0f0f0f]" />
                        <h3 className="text-3xl font-bold mb-4">2023: Inception</h3>
                        <p className="text-gray-400 max-w-2xl">
                            MSTC was founded by a small group of passionate students who wanted to bridge the gap between classroom theory and industry practice.
                        </p>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="text-center py-12">
                    <p className="text-2xl italic font-serif text-gray-500">"Code is just the tool. Impact is the goal."</p>
                </div>
            </main>
        </div>
    );
}
