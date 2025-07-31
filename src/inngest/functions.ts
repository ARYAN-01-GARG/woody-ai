import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
   async ({ event }) => {
    // Input validation
    if (!event.data.value || typeof event.data.value !== 'string') {
      console.error("Invalid input: event.data.value is missing or not a string");
      return "Error: Invalid topic provided";
    }

    try {
      const writer = createAgent({
        name: "writer",
        system: "You are an expert writer.  You write readable, concise, simple content.",
        model: openai({ model: "gpt-4o"}),
      });

      const { output } = await writer.run(`Write a tweet on : ${event.data.value}`);

      console.log("Output from writer:", output);

      return output;
    } catch (error) {
      console.error("Error calling AI agent:", error);
      return "Error: Failed to generate content. Please try again later.";
    }
  }
);