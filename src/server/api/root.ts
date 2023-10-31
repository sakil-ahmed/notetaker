import {createTRPCRouter} from "@/server/api/trpc";
import {topicRouter} from "@/server/api/routers/topic";
import {noteRouter} from "@/server/api/routers/note";


export const appRouter = createTRPCRouter({
    topic: topicRouter,
    note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
