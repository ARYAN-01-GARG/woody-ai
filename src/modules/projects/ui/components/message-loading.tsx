import Image from 'next/image';
import { useState, useEffect } from 'react';

function ShimmerMessages() {
    const messages = [
        "Thinking....",
        "Loading....",
        "Generating....",
        "Analyzing your request....",
        "Building your website....",
        "Crafting Components....",
        "Optimizing layouts....",
        "Adding final touches....",
        "Almost Ready...."
    ]

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className='flex items-center gap-2'>
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentMessageIndex]}
            </span>
        </div>
  )
}

function MessageLoading() {
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    src="/logo.svg"
                    alt="woody"
                    width={24}
                    height={24}
                    className="shrink-0"
                />
                <span className="text-sm text-medium">Woody</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <ShimmerMessages />
            </div>
        </div>
    );
}

export default MessageLoading;