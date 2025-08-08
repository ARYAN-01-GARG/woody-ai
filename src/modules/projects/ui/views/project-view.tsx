"use client";

import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import MessageContainer from "../components/message-container";
import { ResizableHandle, ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectViewProps {
    projectId: string;
}

function ProjectView({ projectId }: ProjectViewProps) {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabValue, setTabValue] = useState<"preview" | "code">("preview");

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
                    <Tabs
                        className="h-full gap-y-0"
                        defaultValue="preview"
                        onValueChange={(value) => setTabValue(value as "preview" | "code")}
                        value={tabValue}
                    >
                        <div className="flex w-full items-center border-b gap-x-2 p-2">
                            <TabsList className="h-8 p-0 border rounded-md">
                                <TabsTrigger value="preview" className="rounded-md">
                                    <EyeIcon className="h-4 w-4" /> <span>Demo</span>
                                </TabsTrigger>
                                <TabsTrigger value="code" className="rounded-md">
                                    <CodeIcon className="h-4 w-4" /> <span>Code</span>
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-x-2">
                                <Button asChild size={'sm'} variant={'default'}>
                                    <Link href="/pricing">
                                     <CrownIcon className="h-4 w-4" /> Upgrade
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="preview">
                            {!!activeFragment && <FragmentWeb data={activeFragment} />}
                        </TabsContent>
                        <TabsContent value="code">
                            <p>Code</p>
                        </TabsContent>
                    </Tabs>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView