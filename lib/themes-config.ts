export type EventThemeKey = 'default' | 'winter' | 'hacktoberfest' | 'github' | 'summer' | 'cp';

export interface ThemeConfig {
    name: string;
    background: string;
    accent: string;
    card: string;
    icon: string;
}

export const EVENT_THEME_CONFIG: Record<EventThemeKey, ThemeConfig> = {
    default: {
        name: 'Default (Legacy)',
        background: 'bg-[#020617]',
        accent: 'text-blue-400 border-blue-500/30',
        card: 'bg-gradient-to-br from-blue-900/20 to-black/50 border-white/10',
        icon: 'text-blue-400'
    },
    winter: {
        name: 'Winter of Code',
        background: 'bg-[#020617]',
        accent: 'text-cyan-200 border-cyan-500/30',
        card: 'bg-slate-900/50 border-cyan-500/20 shadow-[0_0_30px_-5px_rgba(34,211,238,0.05)]',
        icon: 'text-cyan-200'
    },
    hacktoberfest: {
        name: 'Hacktoberfest',
        background: 'bg-[#150229]',
        accent: 'text-purple-400 border-purple-500/30',
        card: 'bg-[#24043e]/50 border-purple-500/20 shadow-[0_0_30px_-5px_rgba(168,85,247,0.1)]',
        icon: 'text-purple-400'
    },
    github: {
        name: 'GitHub / Tech',
        background: 'bg-[#0d1117]',
        accent: 'text-gray-200 border-gray-700',
        card: 'bg-[#161b22]/90 border-gray-800 shadow-xl',
        icon: 'text-white'
    },
    summer: {
        name: 'Summer of Code',
        background: 'bg-[#1c1004]',
        accent: 'text-yellow-200 border-yellow-500/30',
        card: 'bg-orange-950/20 border-yellow-500/10 shadow-[0_0_30px_-5px_rgba(234,179,8,0.05)]',
        icon: 'text-yellow-200'
    },
    cp: {
        name: 'Competitive Programming',
        background: 'bg-black',
        accent: 'text-green-500 border-green-500/50',
        card: 'bg-green-950/10 border-green-500/30 font-mono shadow-[0_0_20px_-5px_rgba(34,197,94,0.1)]',
        icon: 'text-green-500'
    }
};
