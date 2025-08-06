"use client";

import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import MessageContainer from "../components/message-container";
import { ResizableHandle, ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";

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
                <Suspense fallback={<div>Loading project...</div>}>
                    <ProjectHeader projectId={projectId} />
                </Suspense>
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
                {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView