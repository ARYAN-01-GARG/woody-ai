"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Function invoked successfully!");
    }
  }));
  const [value, setValue] = useState("");

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter a value" />
      <Button onClick={() => invoke.mutate({ value })} disabled={invoke.isPending}>
        Invoke Function
      </Button>
    </div>
  );
}