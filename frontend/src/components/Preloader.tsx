import React, { useEffect, useState, useRef } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Optionally have a fallback timeout in case the video fails to load or play
        const fallbackTimeout = setTimeout(() => {
            finishPreloading();
        }, 5000); // 5 seconds max

        return () => clearTimeout(fallbackTimeout);
    }, []);

    const finishPreloading = () => {
        setIsVisible(false);
        setTimeout(() => {
            onComplete();
        }, 500); // 500ms for fade out transition
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <video
                ref={videoRef}
                src="/strt.mp4"
                autoPlay
                muted
                playsInline
                onEnded={finishPreloading}
                className="w-32 h-32 rounded-full object-cover"
                onError={finishPreloading}
            />
        </div>
    );
};
