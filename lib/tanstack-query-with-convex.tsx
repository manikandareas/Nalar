"use client"

import { useAuth } from "@clerk/nextjs";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
        },
    },
});
convexQueryClient.connect(queryClient);

interface ITanstackQueryWithConvexProviderProps extends React.PropsWithChildren { }

export const TanstackQueryWithConvexProvider: React.FC<ITanstackQueryWithConvexProviderProps> = (props) => {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </ConvexProviderWithClerk>
    );
}
