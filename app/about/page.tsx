import { OrigamiNavbar } from '@/components/ui/origami/origami-navbar';
import { FoldCard } from '@/components/ui/origami/fold-card';
import { Terminal, Users, Rocket, Code2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AboutPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-shatter-yellow selection:text-black">
            <OrigamiNavbar />

            <main className="pt-48 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-32">
                {/* Hero Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-10 size-4 bg-shatter-pink animate-spin-slow" />
                    <div className="absolute bottom-10 right-10 size-6 border-2 border-shatter-yellow rotate-12" />

                    <div className="inline-block bg-shatter-yellow border-2 border-black transform -rotate-2 shadow-[4px_4px_0px_black]">
                        <span className="block px-4 py-1 text-black font-black uppercase tracking-widest text-sm transform rotate-2">
                            Est. 2023 // MSTC DAU
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-[#E8EAED] leading-[0.95] drop-shadow-lg">
                        We Don't Just Code. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8EAED] via-[#E8EAED] to-[#9AA0A6]">We Build The</span> <span className="text-shatter-pink">Future.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[#9AA0A6] font-bold max-w-2xl mx-auto leading-relaxed">
                        The Microsoft Student Technical Club is a community of <span className="bg-black text-[#E8EAED] px-1">visionaries</span>. We bridge the gap between classroom theory and industry-shattering impact.
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <FoldCard accent="blue" className="h-full bg-[#303134] hover:bg-black group transition-colors duration-300">
                        <div className="p-8 space-y-4">
                            <div className="size-16 bg-black border-2 border-shatter-yellow flex items-center justify-center shadow-[4px_4px_0px_black] group-hover:shadow-[4px_4px_0px_white] transition-shadow">
                                <Terminal className="size-8 text-shatter-yellow" />
                            </div>
                            <h3 className="text-3xl font-black text-[#E8EAED] uppercase italic tracking-tight group-hover:text-white">Our Mission</h3>
                            <p className="text-[#9AA0A6] font-medium leading-relaxed group-hover:text-[#E8EAED]">
                                To empower students with the technical skills and mindset required to thrive in the modern tech industry through hands-on projects and mentorship.
                            </p>
                        </div>
                    </FoldCard>

                    <FoldCard accent="flame" className="h-full bg-[#303134] hover:bg-black group transition-colors duration-300 transform md:-translate-y-4">
                        <div className="p-8 space-y-4">
                            <div className="size-16 bg-black border-2 border-shatter-pink flex items-center justify-center shadow-[4px_4px_0px_black] group-hover:shadow-[4px_4px_0px_white] transition-shadow">
                                <Users className="size-8 text-shatter-pink" />
                            </div>
                            <h3 className="text-3xl font-black text-[#E8EAED] uppercase italic tracking-tight group-hover:text-white">Our Community</h3>
                            <p className="text-[#9AA0A6] font-medium leading-relaxed group-hover:text-[#E8EAED]">
                                A diverse group of developers, designers, and tech enthusiasts. We believe in peer-to-peer learning and growing together as a <span className="text-shatter-pink">family</span>.
                            </p>
                        </div>
                    </FoldCard>

                    <FoldCard accent="void" className="h-full bg-[#303134] hover:bg-black group transition-colors duration-300">
                        <div className="p-8 space-y-4">
                            <div className="size-16 bg-black border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_black] group-hover:shadow-[4px_4px_0px_white] transition-shadow">
                                <Rocket className="size-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-[#E8EAED] uppercase italic tracking-tight group-hover:text-white">Our Vision</h3>
                            <p className="text-[#9AA0A6] font-medium leading-relaxed group-hover:text-[#E8EAED]">
                                To become the premier student technical hub where every member graduates with a portfolio of impactful projects and a network of lifelong peers.
                            </p>
                        </div>
                    </FoldCard>
                </div>

                {/* History / Timeline Section */}
                <div className="relative border-l-4 border-black ml-4 md:ml-12 space-y-16 pl-8 md:pl-16 py-8">
                    {/* Timeline Item 1 */}
                    <div className="relative group">
                        <div className="absolute -left-[45px] md:-left-[77px] top-2 size-6 bg-shatter-yellow border-4 border-black transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                        <h3 className="text-4xl font-black uppercase italic text-[#E8EAED] mb-4">2025: The Platform Era</h3>
                        <div className="bg-[#303134] border-2 border-black p-6 shadow-[8px_8px_0px_black] inline-block max-w-3xl transform hover:translate-x-2 transition-transform">
                            <p className="text-[#9AA0A6] font-bold text-lg">
                                Launching the <span className="text-shatter-yellow">"Super Techie"</span> platform to gamify learning and streamline event management, marking a new chapter in how we operate.
                            </p>
                        </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative group">
                        <div className="absolute -left-[45px] md:-left-[77px] top-2 size-6 bg-[#9AA0A6] border-4 border-black transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                        <h3 className="text-4xl font-black uppercase italic text-[#E8EAED] mb-4">2024: Expansion</h3>
                        <div className="bg-[#303134] border-2 border-black p-6 shadow-[8px_8px_0px_black] inline-block max-w-3xl transform hover:translate-x-2 transition-transform">
                            <p className="text-[#9AA0A6] font-bold text-lg">
                                Hosted our first city-wide Hackathon <span className="text-white bg-black px-1">"HackNova"</span>, with over 500 participants. Established dedicated domains for AI/ML and Web Development.
                            </p>
                        </div>
                    </div>

                    {/* Timeline Item 3 */}
                    <div className="relative group">
                        <div className="absolute -left-[45px] md:-left-[77px] top-2 size-6 bg-[#9AA0A6] border-4 border-black transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                        <h3 className="text-4xl font-black uppercase italic text-[#E8EAED] mb-4">2023: Inception</h3>
                        <div className="bg-[#303134] border-2 border-black p-6 shadow-[8px_8px_0px_black] inline-block max-w-3xl transform hover:translate-x-2 transition-transform">
                            <p className="text-[#9AA0A6] font-bold text-lg">
                                MSTC was founded by a small group of passionate students who wanted to bridge the gap between classroom theory and industry practice.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="text-center py-20 border-t-4 border-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-shatter-pattern opacity-5" />
                    <Zap className="size-12 text-shatter-yellow mx-auto mb-6 animate-pulse" />
                    <p className="text-3xl md:text-5xl font-black uppercase italic text-[#E8EAED] tracking-tighter">
                        "Code is just the tool. <br />
                        <span className="text-shatter-pink">Impact is the goal.</span>"
                    </p>
                </div>
            </main>
        </div>
    );
}
