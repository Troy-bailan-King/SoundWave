import { auth, clerkClient } from '@clerk/nextjs';
import {z} from 'zod';

import { createTRPCRouter,privateProcedure,publicProcedure } from '~/server/api/trpc';
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from '~/server/helpers/filterUserForClient';

//  This is a helper function that filters out sensitive user data
export const postsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ctx})=>{
        const posts = await ctx.prisma.post.findMany({
            take: 100, 
            orderBy: { createdAt: "desc" },
        });

        const users = (
            await clerkClient.users.getUserList({
            userId: posts.map((post)=>post.authorId),
            limit: 100,
        })).map(filterUserForClient);

        //
        return posts.map((post)=>{
            const author = users.find((user) => user.id === post.authorId);
            if(!author)
                throw new TRPCError({code:"INTERNAL_SERVER_ERROR",
                message:"Author not found"});

            if(!author.username)
                throw new TRPCError({code:"INTERNAL_SERVER_ERROR",
                message:"name not found"});

            return{
                post,
                author:{
                    ...author,
                    username: author.username,
                }
            }
            
        });
    }),

    create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
