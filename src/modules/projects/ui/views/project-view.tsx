"use client";

import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import MessageContainer from "../components/message-container";
import { ResizableHandle, ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

interface ProjectViewProps {
    projectId: string;
}

function ProjectView({ projectId }: ProjectViewProps) {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);


  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
                defaultSize={35}
                minSize={20}
                className="flex min-h-0 flex-col"
            >
                <Suspense fallback={<div>Loading messages...</div>}>
                    <MessageContainer
                        projectId={projectId}
                        activeFragment={activeFragment}
                        setActiveFragment={setActiveFragment}
                    />
                </Suspense>
            </ResizablePanel>
            <ResizableHandle  withHandle />
            <ResizablePanel
                defaultSize={65}
                minSize={50}
                >
                TODO : Preview
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView