import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
   async ({ event , step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("woody-nestjs-temp");
      return sandbox.sandboxId;
    });

    try {
      const writer = createAgent({
        name: "writer",
        system: "You are a experienced nextjs developer. You need to create a professional nextjs project with the given requirements.",
        model: openai({ model: "gpt-4o"}),
      });

      const { output } = await writer.run(`create a project on : ${event.data.value}`);

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);

        return `http://${host}`;
      });

      return { output, sandboxUrl };

    } catch (error) {
      console.error("Error calling AI agent:", error);
      return "Error: Failed to generate content. Please try again later.";
    }
  }
);