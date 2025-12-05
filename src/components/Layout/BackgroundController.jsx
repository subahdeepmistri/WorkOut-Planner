import React from 'react';

export const BackgroundController = ({ profile = 'miles' }) => {
    // Static background with subtle gradient cues for the profile
    const gradientStyle = profile === 'gwen'
        ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-pink-950/20'
        : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950/20';

    return (
        <div className={`fixed inset-0 z-[-1] w-full h-full overflow-hidden ${gradientStyle}`}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[1px]"></div>
        </div>
    );
};
