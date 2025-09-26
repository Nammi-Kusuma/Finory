import { Inngest } from "inngest";

export const inngest2 = new Inngest({
    id: "splito-app", name: "Splito App", retryFunction: async (attempt) => ({
        delay: Math.pow(2, attempt) * 1000, // Exponential backoff
        maxAttempts: 2,
    }),
});