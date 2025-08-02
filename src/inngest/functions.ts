import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

export const codeAgentFunction = inngest.createFunction(
  { id: "codeAgentFunction" },
  { event: "code-agent" },
   async ({ event , step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("woody-nestjs-temp");
      return sandbox.sandboxId;
    });

    try {
      const codeAgent = createAgent({
        name: "codeAgent",
        system: PROMPT,
        description: "An AI Expert coding agent that can create a nextjs project",
        model: openai({ model: "gpt-4o"}),
        tools : [
          createTool({
            name: "terminal",
            description: "Run terminal commands to create a nextjs project",
            handler: async ({ command }: { command: string }, { step }) => {
              return await step?.run("terminal", async () => {
                const buffer = { stdout : "", stderr: "" };
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    onStdout: (data) => {
                      buffer.stdout += data;
                    },
                    onStderr: (data) => {
                      buffer.stderr += data;
                    },
                  });
                  return result.stdout;
                } catch (error) {
                  console.log(`command failed: ${error}\nstderr: ${buffer.stderr}\nstdout: ${buffer.stdout}`);
                  return `command failed: ${error}\nstderr: ${buffer.stderr}\nstdout: ${buffer.stdout}`;
                }
              });
            }
          }),
          createTool({
            name : "createOrUpdateFiles",
            description: "Create or update files in the project",
            handler: async ({ files } : { files : { path : string, content: string }[]}, { step, network }) => {
              const newFiles = await step?.run("create-or-update-files", async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (e) {
                  console.error("Error :", e);
                  return `Error: ${e}`;
                }
              });
              if (typeof newFiles === "object") {
                return newFiles;
              }
            }
          }),
          createTool({
            name: "ReadFiles",
            description: "Read files from the project",
            handler: async ({ files } : { files : string[]}, { step }) => {
              return await step?.run("readFiles", async () => {
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const contents = [];
                  for(const file of files){
                    const fileContents = await sandbox.files.read(file);
                    contents.push({ path: file, content: fileContents });
                  }
                  return contents;
                } catch (e) {
                  console.error("Error :", e);
                  return `Error: ${e}`;
                }
              });
            }
          }),
        ],
        lifecycle: {
          onResponse : async ({ result, network }) => {
            const lastAssistantMessageText = lastAssistantTextMessageContent(result);
            if(lastAssistantMessageText && network){
              if(lastAssistantMessageText.includes('<task_summary>')){
                network.state.data.summary = lastAssistantMessageText
              }
            }
            return result;
          },
        },
      });

      const network = createNetwork({
        name : "coding-agent-network",
        agents : [codeAgent],
        maxIter : 15,
        router : async ({ network }) => {
          const summary = network.state.data.summary;
          if(summary){
            return;
          }
          return codeAgent;
        }
      });

      const result = await network.run(event.data.value);

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `http://${host}`;
      });

      await step.run("save-result", async () => {
        await prisma.message.create({
          data: {
            content : result.state.data.summary,
            role : "ASSISTANT",
            type : "RESULT",
            fragment : {
              create : {
                sandboxUrl : sandboxUrl,
                title : "Fragments",
                files : result.state.data.files,
              },
            }
          }
        })
      });

      return {
        url : sandboxUrl,
        title : "Fragment",
        files : result.state.data.files,
        summary : result.state.data.summary,
      };

    } catch (error) {
      console.error("Error calling AI agent:", error);
      return "Error: Failed to generate content. Please try again later.";
    }
  }
);