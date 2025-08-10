import { Fragment, useCallback, useMemo, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";
import Hint from "./hint";
import { Button } from "./button";
import { CheckCheckIcon, CopyIcon } from "lucide-react";
import { CodeView } from "../code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "../tree/tree-view";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";

export type FileCollection = { [path: string]: string };

interface FileBreadCrumbProps {
    filePath : string;
}

const FileBreadCrumb = ({ filePath } : FileBreadCrumbProps ) => {
    const pathSegments = filePath.split('/');
    const maxSegments = 4;
    const renderBreadcrumbsItems = () => {
        if( pathSegments.length <= maxSegments) {
            return pathSegments.map((segment, index) => {
                const isLastSegment = index === pathSegments.length - 1;
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLastSegment ? (
                                <BreadcrumbPage>
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className="text-muted-foreground">
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>
                        {!isLastSegment && (
                            <BreadcrumbSeparator />
                        )}
                    </Fragment>
                );
            });
        } else {
            const firstSegments = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];

            return (
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">{firstSegments}</span>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis/>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )
        }
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadcrumbsItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

function getLanguageFromExtention(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext || 'txt';
}

interface FileExplorerProps {
    files: FileCollection;
};

export function FileExplorer({
    files,
}: FileExplorerProps) {

    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files)
    }, [files])

    const handleFileSelect = useCallback((
        filePath : string
    ) => {
        if(files[filePath]){
            setSelectedFile(filePath);
        }
    }, [files])

    const [copy, setCopy] = useState(false);

    const handleCopy = useCallback(() => {
        if (selectedFile) {
            navigator.clipboard.writeText(files[selectedFile]);
            setCopy(true);
            setTimeout(() => setCopy(false), 2000);
        }
    }, [selectedFile, files]);

    return (
       <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                <TreeView
                    data={treeData}
                    value={selectedFile}
                    onSelect={handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors" />
            <ResizablePanel defaultSize={70} minSize={50}>
                { selectedFile && files[selectedFile] ? (
                    <div className="h-full w-full flex flex-col">
                        <div className="py-2 px-4 bg-sidebar border-b flex justify-between items-center gap-x-2 ">
                            <FileBreadCrumb filePath={selectedFile} />
                            <Hint text="copy to clipboard" side="bottom">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    disabled={copy}
                                    className="ml-auto"
                                >
                                    {copy ? <CheckCheckIcon /> : <CopyIcon />}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <CodeView
                                code={files[selectedFile]}
                                language={getLanguageFromExtention(selectedFile)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view its contents
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
