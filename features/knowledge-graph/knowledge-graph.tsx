'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const KnowledgeGraph = () => {
    const currentUser = useQuery(api.users.queries.getCurrentUser)
    const graphData = useQuery(api.knowledge.queries.getGraph, { userId: currentUser?._id as Id<"users"> });

    const formattedData = useMemo(() => {
        if (!graphData) return { nodes: [], links: [] };

        const nodes = graphData.nodes.map(node => ({
            id: node._id,
            name: node.topic,
            val: node.understandingLevel,
        }));

        const links = graphData.edges.map(edge => ({
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            label: edge.label,
        }));

        return { nodes, links };
    }, [graphData]);

    if (!graphData) {
        return <div>Loading Knowledge Graph...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Knowledge Graph</CardTitle>
            </CardHeader>
            <CardContent>
                <ForceGraph2D
                    graphData={formattedData}
                    nodeLabel="name"
                    nodeAutoColorBy="name"
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    linkCurvature={0.25}
                />
            </CardContent>
        </Card>
    );
};

export default KnowledgeGraph;
