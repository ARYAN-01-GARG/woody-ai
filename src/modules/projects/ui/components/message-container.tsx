"use client";

import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import MessageForm from "./message-form";
import MessageCard from "./message-card";
import { useSuspenseQuery } from "@tanstack/react-query";

interface MessageContainerProps {
    projectId: string;
}

function MessageContainer({ projectId }: MessageContainerProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({ projectId }));

    useEffect(() => {
        const lastAssistantMessage = messages.findLast((message => message.role === "ASSISTANT"));
        if (lastAssistantMessage) {
            // TODO: Scroll to the last assistant message
        }
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

  return (
    <div className=" flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="pt-2 pr-1">
                {messages.map((message) => (
                    <MessageCard
                        key={message.id}
                        content={message.content}
                        role={message.role}
                        fragment={message.fragment}
                        createdAt={message.createdAt}
                        isActiveFragment={false}
                        onFragmentClick={() => {}}
                        type={message.type}
                    />
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
        <div className="relative p-3 pt-1">
            <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/90" />
            <MessageForm projectId={projectId} />
        </div>
    </div>
  )
}

export default MessageContainer