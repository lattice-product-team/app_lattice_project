import { db, nodes, pathSegments, pointsOfInterest, sql, eq } from '@app/db';
// --- Helper Functions ---
/**
 * Resolves lat/lng coordinates from either raw values or a POI ID.
 */
async function resolveCoords(input) {
    if (input.poiId) {
        const [poi] = await db
            .select({
            location: sql `ST_AsText(location)`,
        })
            .from(pointsOfInterest)
            .where(eq(pointsOfInterest.id, input.poiId));
        if (!poi)
            throw new Error(`POI with ID ${input.poiId} not found`);
        const match = poi.location.match(/POINT\((.+) (.+)\)/);
        if (!match)
            throw new Error('Invalid POI location format in database');
        return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
    if (input.lat !== undefined && input.lng !== undefined) {
        return { lat: input.lat, lng: input.lng };
    }
    throw new Error('Invalid origin/destination: coords or poiId required');
}
/**
 * Builds the adjacency list for the routing graph.
 */
function buildAdjacencyList(nodes, edges, options) {
    const graph = {};
    nodes.forEach((n) => (graph[n.id] = []));
    edges.forEach((e) => {
        // Accessibility filters
        if (options.avoidStairs && e.hasStairs)
            return;
        if (options.wheelchairAccess && e.hasStairs)
            return; // Wheelchairs definitely avoid stairs
        let weight = e.distance;
        if (e.crowdLevel === 'high')
            weight *= 1.5;
        if (e.crowdLevel === 'blocked')
            weight *= 10;
        graph[e.sourceNodeId].push({
            target: e.targetNodeId,
            weight,
            hasStairs: !!e.hasStairs,
        });
    });
    return graph;
}
/**
 * Reconstructs the coordinate path from the predecessor map.
 */
async function reconstructPath(pathNodes) {
    const resultNodes = await db
        .select({
        id: nodes.id,
        location: sql `ST_AsGeoJSON(location)`,
    })
        .from(nodes)
        .where(sql `${nodes.id} IN (${sql.join(pathNodes, sql `, `)})`);
    const nodeMap = new Map(resultNodes.map((n) => [n.id, JSON.parse(n.location)]));
    return pathNodes.map((id) => {
        const nodeData = nodeMap.get(id);
        if (!nodeData) {
            console.error(`[NavigationService] Node ${id} missing from resolved results`);
            throw new Error(`Graph inconsistency: node ${id} lost during reconstruction`);
        }
        return nodeData.coordinates;
    });
}
// --- Main Service Function ---
export async function findRoute(origin, destination, options = {}) {
    const startCoords = await resolveCoords(origin);
    const endCoords = await resolveCoords(destination);
    // 1. Find entry/exit nodes
    const [startNode] = await db
        .select({ id: nodes.id })
        .from(nodes)
        .orderBy(sql `location <-> ST_SetSRID(ST_Point(${startCoords.lng}, ${startCoords.lat}), 4326)`)
        .limit(1);
    const [endNode] = await db
        .select({ id: nodes.id })
        .from(nodes)
        .orderBy(sql `location <-> ST_SetSRID(ST_Point(${endCoords.lng}, ${endCoords.lat}), 4326)`)
        .limit(1);
    if (!startNode || !endNode) {
        throw new Error('Routing error: No accessible path nodes found near location');
    }
    // 2. Build graph context
    let nodeQuery = db.select().from(nodes).$dynamic();
    let edgeQuery = db.select().from(pathSegments).$dynamic();
    if (options.eventId) {
        nodeQuery = nodeQuery.where(eq(nodes.eventId, options.eventId));
        // For edges, we filter based on the source node's event_id
        // This assumes segments don't cross between events (which they shouldn't in this model)
        edgeQuery = edgeQuery.where(sql `source_node_id IN (SELECT id FROM nodes WHERE event_id = ${options.eventId})`);
    }
    const allNodes = await nodeQuery;
    const allEdges = await edgeQuery;
    const graph = buildAdjacencyList(allNodes, allEdges, options);
    // 3. Dijkstra Core
    const distances = {};
    const previous = {};
    const queue = [];
    allNodes.forEach((node) => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
        queue.push(node.id);
    });
    distances[startNode.id] = 0;
    while (queue.length > 0) {
        queue.sort((a, b) => distances[a] - distances[b]);
        const u = queue.shift();
        if (u === endNode.id || distances[u] === Infinity)
            break;
        const neighbors = graph[u] || [];
        for (const neighbor of neighbors) {
            const alt = distances[u] + neighbor.weight;
            if (alt < distances[neighbor.target]) {
                distances[neighbor.target] = alt;
                previous[neighbor.target] = u;
            }
        }
    }
    // 4. Path reconstruction
    const pathNodeIds = [];
    let curr = endNode.id;
    while (curr !== null) {
        pathNodeIds.unshift(curr);
        curr = previous[curr];
    }
    if (pathNodeIds[0] !== startNode.id) {
        throw new Error('No path available between these locations');
    }
    const coordinates = await reconstructPath(pathNodeIds);
    return {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates,
        },
        properties: {
            distance: distances[endNode.id],
            durationEstimate: Math.round(distances[endNode.id] / 1.4), // 1.4 m/s avg walking speed
        },
    };
}
