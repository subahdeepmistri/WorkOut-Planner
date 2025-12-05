import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen pb-24 pt-28 relative">
            {/* Cinematic Background */}
            <div className="spidey-bg-layer">
                <img src="/assets/bg1.jpg" alt="" className="slideshow-image" />
                <img src="/assets/bg2.jpg" alt="" className="slideshow-image" />
            </div>
            <div className="fixed inset-0 bg-black/70 z-[-1]" />

            <Header />

            <main className="px-4 max-w-md mx-auto relative z-10">
                {children}
            </main>

            <BottomNav />
        </div>
    );
};
