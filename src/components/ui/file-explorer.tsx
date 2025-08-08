import { ResizablePanel, ResizablePanelGroup } from "./resizable";

type FileCollection = { [path: string]: string };

function getLanguageFromExtention(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext || 'txt';
}

interface FileExplorerProps {
    files: FileCollection;
    onFileClick: (filePath: string) => void;
}

export function FileExplorer({
    files,
}: FileExplorerProps) {
    return (
       <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={20} className="flex flex-col">

            </ResizablePanel>
       </ResizablePanelGroup>
    );
}
