"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const { data : messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message Sent successfully!");
    }
  }));
  const [value, setValue] = useState("");

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter a value" />
      <Button onClick={() => createMessage.mutate({ value })} disabled={createMessage.isPending}>
        Send Message
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
}