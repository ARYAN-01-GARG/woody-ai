import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
   async ({ event }) => {
    const writer = createAgent({
      name: "writer",
      system: "You are an expert writer.  You write readable, concise, simple content.",
      model: openai({ model: "gpt-4o"}),
    });

    const { output } = await writer.run(`Write a tweet on : ${event.data.topic}`);

    console.log("Output from writer:", output);

    return output;
  }
);