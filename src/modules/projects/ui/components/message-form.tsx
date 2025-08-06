import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    value: z.string().min(1, { message: "Value is required" }).max(10000, { message : "Message is too long" }),
});

interface Props {
    projectId: string;
}

function MessageForm({ projectId }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isFocused, setIsFocused] = useState(false);
    const showUsage = false;
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
        },
        onError: (error) => {
            toast.error(error.message || "Failed to send message");
        }
    }));

    const isPending = createMessage.isPending;
    const isDisabled = isPending || !form.formState.isValid;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId : projectId,
        });
    };

  return (
    <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all", 
                isFocused && "shadow-xs",
                showUsage && "rounded-t-none",
            )}
        >
            <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <TextareaAutosize
                        {...field}
                        disabled={isPending}
                        placeholder="Type your message here..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        minRows={2}
                        maxRows={8}
                        className={cn(
                            "pt-4 resize-none border-none w-full outline-none bg-transparent"
                        )}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)(e);
                            }
                        }}
                    />
                )}
            />
            <div className="flex gap-x-2 items-end justify-between pt-2">
                <div className="text-[10px] text-muted-foreground font-medium">
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5  font-mono texxt-[10px] font-medium text-muted-foreground">
                        <span className="">&#8984;</span>Enter
                    </kbd>
                </div>
                <Button
                    type="submit"
                    disabled={isDisabled}
                    className={cn(
                        "size-8 rounded-full",
                        isDisabled && "bg-muted-foreground border"
                    )}
                >
                    {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <ArrowUpIcon className="size-4" />}
                </Button>
            </div>
        </form>
    </Form>
  )
}


export default MessageForm