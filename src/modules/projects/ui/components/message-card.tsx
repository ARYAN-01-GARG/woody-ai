import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";

interface Props {
    content  : string;
    role     : MessageRole;
    type     : MessageType;
    fragment : Fragment | null;
    isActiveFragment : boolean;
    createdAt: Date;
    onFragmentClick: ( fragment: Fragment | null ) => void;
}

function MessageCard({
    content,
    role,
    type,
    fragment,
    isActiveFragment,
    createdAt,
    onFragmentClick
}: Props
) {

    if(role === "ASSISTANT"){
        return (
            <AssistantMessage
                content={content}
                fragment={fragment}
                isActiveFragment={isActiveFragment}
                createdAt={createdAt}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }
  return (
    <UserMessage content={content} />
  )
}

const UserMessage = ({ content }: Pick<Props, "content">) => {
    return (
        <div className="flex justify-end pr-2 pb-4 pl-10">
            <Card className="rounded-lg bg-muted shadow-none p-3 border-none max-w-[80%] break-words">
                {content}
            </Card>
        </div>
    );
}

const AssistantMessage = ({
    content,
    fragment,
    isActiveFragment,
    createdAt,
    onFragmentClick,
    type
}: Omit<Props, "role">) => {
    return (
        <div className={cn(
            "flex flex-col group px-2 pb-4",
            type === "ERROR" && "text-red-700 dark:text-red-500",
        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    src={'/logo.svg'}
                    alt="Woody"
                    width={32}
                    height={24}
                />
                <span className="text-sm font-medium">Woody</span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4 ">
                <span>{content}</span>
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>
    );
}

const FragmentCard = ({
    fragment,
    isActiveFragment,
    onFragmentClick
}: Pick<Props, "fragment" | "isActiveFragment" | "onFragmentClick">) => {
    return (
        <button className={cn(
            "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors cursor-pointer",
            isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary"
        )}
            onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className="size-4 mt-0.5"/>
            <div className="flex flex-col flex-1">
                {fragment?.title && (
                    <>
                        <span className="text-sm font-medium line-clamp">{fragment.title}</span>
                        <span className="text-sm">Preview</span>
                    </>
                )}
            </div>
            <div className="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="size-4" />
            </div>
        </button>
    );
}

export default MessageCard