import { createTool } from "@convex-dev/agent";
import FirecrawlApp from "@mendable/firecrawl-js";
import { gatherRelevantResourceSchema } from "./validators";


const fireCrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

export const gatherRelevantResourceTool = createTool({
    args: gatherRelevantResourceSchema,
    description: "Gather relevant resources for the given query",
    handler: async (ctx, args) => {
        try {
            const result = await fireCrawl.search(args.query, {
                limit: 3,
                scrapeOptions: {
                    "formats": ["markdown"]
                }
            });

            if (result.success) {
                return result.data.map(r => ({
                    title: r.title,
                    description: r.description,
                    url: r.url,
                    content: r.markdown,
                    og: r.metadata?.ogImage
                }))
            }

            return []
        } catch (error) {
            console.error("Failed to search resources")
            console.error(error)
            return []
        }
    }
})