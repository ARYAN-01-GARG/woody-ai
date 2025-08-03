"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResizableHandle, ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import MessageContainer from "../components/message-container";
import { Suspense } from "react";

interface ProjectViewProps {
    projectId: string;
}

function ProjectView({ projectId }: ProjectViewProps) {
    const trpc = useTRPC();
    const { data : project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({ id: projectId }));

  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
                defaultSize={35}
                minSize={20}
                className="flex min-h-0 flex-col"
            >
                <Suspense fallback={<div>Loading messages...</div>}>
                    <MessageContainer projectId={projectId} />
                </Suspense>
            </ResizablePanel>
            <ResizableHandle  withHandle />
            <ResizablePanel
                defaultSize={65}
                minSize={50}
                >
                {JSON.stringify(project)}
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView