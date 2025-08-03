import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                projectId: z.string().min(1, { message: "Invalid project ID" })
            })
        )
        .query(async ({ input }) => {
            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId
                },
                orderBy: {
                    updatedAt: "asc",
                },
                include: {
                    fragment : true,
                }
            });
            return messages;
        }),
    create : baseProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Value is required" }).max(10000, { message : "Message is too long" }),
                projectId : z.string().min(1, { message: "Invalid project ID" })
            })
        )
        .mutation(async ({ input }) => {
            const newMessage = await prisma.message.create({
                data: {
                    content: input.value,
                    projectId : input.projectId,
                    role : "USER",
                    type : "RESULT"
                },
            });

            await inngest.send({
                name: "code-agent",
                data: {
                    value : input.value,
                },
            })
            return newMessage;
        })
});