import { query } from "../_generated/server";
import { assertUserAuthenticated } from "../users/utils";

export const getMyLearningPlan = query({
    args: {},
    handler: async (ctx) => {
        const user = await assertUserAuthenticated(ctx);

        const learningPlan = await ctx.db
            .query("learning_plans")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .first();

        return learningPlan;
    },
});
